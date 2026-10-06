#!/usr/bin/env node
// Deterministic, read-only third-party inventory derived from web/package-lock.json.
// Prepares input for license review; draws no legal compatibility conclusions.
// Reads only the lockfile (and, for --check, the committed inventory). No network,
// no node_modules, no secrets, no package file modification.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const LOCKFILE_REL = ['web', 'package-lock.json'];
const OUTPUT_REL = ['docs', 'third-party-inventory.json'];

function compareCodepoints(a, b) {
  const ia = a[Symbol.iterator]();
  const ib = b[Symbol.iterator]();
  for (;;) {
    const na = ia.next();
    const nb = ib.next();
    if (na.done && nb.done) return 0;
    if (na.done) return -1;
    if (nb.done) return 1;
    const ca = na.value.codePointAt(0);
    const cb = nb.value.codePointAt(0);
    if (ca !== cb) return ca < cb ? -1 : 1;
  }
}

function requireNonEmptyString(value, field, key) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`packages[${JSON.stringify(key)}].${field} must be a nonempty string`);
  }
  return value;
}

function optionalString(value, field, key) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`packages[${JSON.stringify(key)}].${field} must be a string when present`);
  }
  return value.length === 0 ? null : value;
}

export function buildInventory(root = DEFAULT_ROOT) {
  const lockPath = path.join(root, ...LOCKFILE_REL);
  const bytes = readFileSync(lockPath);
  const sha256 = createHash('sha256').update(bytes).digest('hex').toUpperCase();

  const lock = JSON.parse(bytes.toString('utf8'));
  if (lock === null || typeof lock !== 'object' || Array.isArray(lock)) {
    throw new Error('package-lock.json must contain a JSON object');
  }
  const entries = lock.packages;
  if (entries === null || typeof entries !== 'object' || Array.isArray(entries)) {
    throw new Error('package-lock.json must contain a "packages" object');
  }

  const keys = Object.keys(entries).filter((key) => key !== '').sort(compareCodepoints);

  const packages = [];
  const licenseTally = new Map();
  let missingResolved = 0;
  let missingIntegrity = 0;

  for (const key of keys) {
    const entry = entries[key];
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`packages[${JSON.stringify(key)}] must be an object`);
    }
    const version = requireNonEmptyString(entry.version, 'version', key);
    const license = requireNonEmptyString(entry.license, 'license', key);
    const resolved = optionalString(entry.resolved, 'resolved', key);
    const integrity = optionalString(entry.integrity, 'integrity', key);

    if (resolved === null) missingResolved += 1;
    if (integrity === null) missingIntegrity += 1;
    licenseTally.set(license, (licenseTally.get(license) ?? 0) + 1);

    packages.push({
      package_path: key,
      version,
      license,
      dev: entry.dev === true,
      optional: entry.optional === true,
      resolved,
      integrity,
    });
  }

  const licenseCounts = [...licenseTally.keys()]
    .sort(compareCodepoints)
    .map((license) => ({ license, count: licenseTally.get(license) }));

  return {
    schema_version: 1,
    package_lock_sha256: sha256,
    package_count: packages.length,
    license_counts: licenseCounts,
    missing_resolved_count: missingResolved,
    missing_integrity_count: missingIntegrity,
    packages,
  };
}

export function renderInventory(inventory) {
  return `${JSON.stringify(inventory, null, 2)}\n`;
}

function main(argv) {
  const rendered = renderInventory(buildInventory(DEFAULT_ROOT));
  const outputPath = path.join(DEFAULT_ROOT, ...OUTPUT_REL);

  if (argv.length === 0) {
    process.stdout.write(rendered);
    return 0;
  }
  if (argv.length !== 1) {
    process.stderr.write('usage: node tools/third-party-inventory.mjs [--write | --check]\n');
    return 2;
  }

  const [mode] = argv;
  if (mode === '--write') {
    try {
      writeFileSync(outputPath, rendered, { encoding: 'utf8', flag: 'wx' });
    } catch (error) {
      if (error && error.code === 'EEXIST') {
        process.stderr.write(`refusing to overwrite existing ${OUTPUT_REL.join('/')}\n`);
        return 1;
      }
      throw error;
    }
    process.stdout.write(`wrote ${OUTPUT_REL.join('/')}\n`);
    return 0;
  }
  if (mode === '--check') {
    let existing;
    try {
      existing = readFileSync(outputPath);
    } catch (error) {
      process.stderr.write(`cannot read ${OUTPUT_REL.join('/')}: ${error.message}\n`);
      return 1;
    }
    if (Buffer.compare(existing, Buffer.from(rendered, 'utf8')) !== 0) {
      process.stderr.write(`${OUTPUT_REL.join('/')} is out of date with web/package-lock.json\n`);
      return 1;
    }
    process.stdout.write(`${OUTPUT_REL.join('/')} is up to date\n`);
    return 0;
  }

  process.stderr.write(`unknown argument: ${mode}\n`);
  process.stderr.write('usage: node tools/third-party-inventory.mjs [--write | --check]\n');
  return 2;
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === pathToFileURL(SCRIPT_PATH).href;

if (invokedDirectly) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`third-party-inventory: ${error.message}\n`);
    process.exitCode = 1;
  }
}
