#!/usr/bin/env node
// Read-only audit of an explicitly supplied public repository tree.
// Usage: node tools/public-tree-audit-v2.mjs <absolute-root>
// Prints a JSON report to stdout and exits 0 only when status is PASS.
// Findings are technical signals for human review, not legal conclusions.

import { createHash } from 'node:crypto';
import { lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_FILES = [
  '.github/workflows/ci.yml',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'decisions/OD-FORJAVIA-CLOUD-BOOTSTRAP-01.md',
  'docs/18-cloud-continuation-handoff.md',
  'docs/architecture-v1.3.md',
  'state/bootstrap-continuity.json',
  'tools/bridge/bridge.mjs',
];

// Sensitive literals are assembled at runtime or expressed with regex quantifiers
// so this file does not flag itself.
const FORBIDDEN_PREFIXES = [
  ['packs', ['mu', 'online'].join('-'), ''].join('/'),
  'references/',
  'runtime/',
  'state/',
];

// Exact-path exemption from FORBIDDEN_PREFIXES for versioned canonical continuity state.
// Runtime/session state is not public; siblings stay blocked and content scans still apply.
const ALLOWED_EXACT_PATHS = new Set(['state/bootstrap-continuity.json']);

const FORBIDDEN_SEGMENTS = new Set(['node_modules', '.openai', '.local', '.git']);

const FORBIDDEN_TERMS = [
  { category: 'forbidden_term_legacy_client', pattern: termPattern(['client', 'unity']) },
  { category: 'forbidden_term_legacy_server', pattern: termPattern([['open', 'mu'].join('')]) },
  { category: 'forbidden_term_legacy_game', pattern: termPattern([['mu', 'online'].join('-')]) },
  { category: 'forbidden_term_external_board', pattern: termPattern([['tre', 'llo'].join('')]) },
  { category: 'forbidden_term_private_identifier', pattern: termPattern([['claude', '_pzs8', 'sxrjxfjjc'].join('')]) },
  { category: 'windows_user_path', pattern: /\b[a-z]:[\\/]+users[\\/]+[^\\/\s"'`<>]+/i },
  { category: 'uwp_localcache_path', pattern: /packages[\\/]+[^\\/\s"'`<>]+[\\/]+localcache/i },
];

const SECRET_PATTERNS = [
  // Matches PEM headers such as BEGIN PRIVATE KEY or BEGIN RSA PRIVATE KEY wrapped in five hyphens.
  // The {5} quantifier keeps this source line from matching itself.
  { category: 'private_key_header', pattern: /-{5}BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY(?: BLOCK)?-{5}/ },
  { category: 'github_token', pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}/ },
  { category: 'github_token', pattern: /\bgithub_pat_[A-Za-z0-9_]{22,}/ },
  { category: 'anthropic_api_key', pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}/ },
  { category: 'openai_api_key', pattern: /\bsk-(?!ant-)(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{20,}/ },
];

const SENSITIVE_NAME = '(?:pass(?:word|wd|phrase)|pwd|secret|api[_-]?key|access[_-]?key|access[_-]?token|auth[_-]?token|refresh[_-]?token|private[_-]?key|credentials?)';
const QUOTED_ASSIGNMENT = new RegExp(`${SENSITIVE_NAME}[A-Za-z0-9_]*["']?[ \\t]*[:=][ \\t]*["'\`]([^"'\`\\s]{8,})["'\`]`, 'gi');
// The optional \r lets the multiline anchor match CRLF line endings.
const ENV_ASSIGNMENT = new RegExp(`^[ \\t]*(?:export[ \\t]+)?[A-Za-z0-9_]*${SENSITIVE_NAME}[A-Za-z0-9_]*[ \\t]*=[ \\t]*([^\\s"'\`#]{8,})[ \\t]*\\r?$`, 'gim');
const PLACEHOLDER = /^(?:\$|<|%|\{\{)|example|placeholder|change_?me|your[_-]|xxx|\*{3}|redacted|dummy|sample|process\.env|import\.meta/i;

function termPattern(words) {
  const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(escaped.join('\\s+'), 'i');
}

function sha256Upper(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function ordinalCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeLocation(location) {
  const resolved = path.resolve(location);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function isAbsoluteRoot(arg) {
  if (!path.isAbsolute(arg)) return false;
  if (process.platform === 'win32') return /^[a-zA-Z]:[\\/]/.test(arg) || /^\\\\[^\\]/.test(arg);
  return true;
}

function walk(rootPath, rootReal, relSegments, files, failures) {
  const dirPath = path.join(rootPath, ...relSegments);
  const dirRel = relSegments.length === 0 ? '.' : relSegments.join('/');
  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    failures.push({ category: 'unreadable_directory', path: dirRel });
    return;
  }

  for (const entry of entries) {
    const name = entry.name;
    const segments = [...relSegments, name];
    const rel = segments.join('/');
    const full = path.join(dirPath, name);

    if (/[\t\r\n\\]/.test(name)) {
      failures.push({ category: 'unsupported_path_character', path: rel });
      continue;
    }

    let stats;
    try {
      stats = lstatSync(full);
    } catch {
      failures.push({ category: 'unreadable_entry', path: rel });
      continue;
    }

    if (stats.isSymbolicLink()) {
      failures.push({ category: 'symlink_or_junction', path: rel });
      continue;
    }

    if (stats.isDirectory()) {
      if (relSegments.length === 0 && name === '.git') continue;
      let real;
      try {
        real = realpathSync.native(full);
      } catch {
        failures.push({ category: 'unreadable_directory', path: rel });
        continue;
      }
      if (normalizeLocation(real) !== normalizeLocation(path.join(rootReal, ...segments))) {
        failures.push({ category: 'reparse_point_mismatch', path: rel });
        continue;
      }
      walk(rootPath, rootReal, segments, files, failures);
    } else if (stats.isFile()) {
      files.push({ path: rel, full });
    } else {
      failures.push({ category: 'unsupported_entry_type', path: rel });
    }
  }
}

function checkPath(rel, failures) {
  const lower = rel.toLowerCase();
  if (!ALLOWED_EXACT_PATHS.has(lower) && FORBIDDEN_PREFIXES.some((prefix) => lower.startsWith(prefix))) {
    failures.push({ category: 'forbidden_path_prefix', path: rel });
  }
  for (const segment of lower.split('/')) {
    if (FORBIDDEN_SEGMENTS.has(segment)) {
      failures.push({ category: 'forbidden_path_segment', path: rel });
    } else if (segment.startsWith('.env')) {
      failures.push({ category: 'forbidden_env_file', path: rel });
    }
  }
}

function decodeTextLike(buffer) {
  if (buffer.includes(0)) return null;
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return null;
  }
}

function hasRealAssignment(text, pattern) {
  for (const match of text.matchAll(pattern)) {
    const value = match[1];
    if (/\d/.test(value) && !PLACEHOLDER.test(value)) return true;
  }
  return false;
}

function scanText(rel, text, failures) {
  for (const { category, pattern } of FORBIDDEN_TERMS) {
    if (pattern.test(text)) failures.push({ category, path: rel });
  }
  for (const { category, pattern } of SECRET_PATTERNS) {
    if (pattern.test(text)) failures.push({ category, path: rel });
  }
  if (hasRealAssignment(text, QUOTED_ASSIGNMENT) || hasRealAssignment(text, ENV_ASSIGNMENT)) {
    failures.push({ category: 'credential_assignment', path: rel });
  }
}

function finalizeFailures(failures) {
  const seen = new Map();
  for (const failure of failures) {
    const key = `${failure.path ?? ''}\u0000${failure.category}`;
    if (!seen.has(key)) seen.set(key, failure);
  }
  return [...seen.values()].sort(
    (a, b) => ordinalCompare(a.path ?? '', b.path ?? '') || ordinalCompare(a.category, b.category),
  );
}

function emit(report, exitCode) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = exitCode;
}

function main() {
  const audit = 'public-tree-audit-v2';
  const note = 'Technical checks only; no legal conclusions are made.';
  const arg = process.argv[2];
  const invalidRoot = (category) =>
    emit(
      {
        audit,
        status: 'FAIL',
        file_count: 0,
        inventory_sha256: null,
        failure_count: 1,
        failures: [{ category }],
        files: [],
        note,
      },
      2,
    );

  if (!arg || process.argv.length > 3) return invalidRoot('usage_requires_single_absolute_root');
  if (!isAbsoluteRoot(arg)) return invalidRoot('root_not_absolute');

  let rootStats;
  try {
    rootStats = lstatSync(arg);
  } catch {
    return invalidRoot('root_unreadable');
  }
  if (rootStats.isSymbolicLink()) return invalidRoot('root_is_symlink_or_junction');
  if (!rootStats.isDirectory()) return invalidRoot('root_not_directory');

  const rootPath = path.resolve(arg);
  let rootReal;
  try {
    rootReal = realpathSync.native(rootPath);
  } catch {
    return invalidRoot('root_unreadable');
  }

  const failures = [];
  const found = [];
  walk(rootPath, rootReal, [], found, failures);
  found.sort((a, b) => ordinalCompare(a.path, b.path));

  const files = [];
  for (const { path: rel, full } of found) {
    checkPath(rel, failures);
    let buffer;
    try {
      buffer = readFileSync(full);
    } catch {
      failures.push({ category: 'unreadable_file', path: rel });
      continue;
    }
    files.push({ path: rel, sha256: sha256Upper(buffer) });
    const text = decodeTextLike(buffer);
    if (text !== null) scanText(rel, text, failures);
  }

  const present = new Set(files.map((file) => file.path));
  for (const required of REQUIRED_FILES) {
    if (!present.has(required)) failures.push({ category: 'missing_required_file', path: required });
  }

  let inventorySha256 = null;
  if (files.length === 0) {
    failures.push({ category: 'empty_tree' });
  } else {
    const records = files.map((file) => `${file.path}\t${file.sha256}\n`).join('');
    inventorySha256 = sha256Upper(Buffer.from(records, 'utf8'));
  }

  const finalFailures = finalizeFailures(failures);
  const status = finalFailures.length === 0 ? 'PASS' : 'FAIL';
  emit(
    {
      audit,
      status,
      file_count: files.length,
      inventory_sha256: inventorySha256,
      failure_count: finalFailures.length,
      failures: finalFailures,
      files,
      note,
    },
    status === 'PASS' ? 0 : 1,
  );
}

main();
