#!/usr/bin/env node
// Public docs invariant guard. Read-only: prints PASS (exit 0) or per-finding diagnostics (exit 1).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARCH = 'docs/architecture-v1.3.md';
const HISTORY = new Set(['docs/06-decisoes.md', 'docs/superseded-decisions.md']);
const failures = [];

const fail = (check, file, line, msg, text = '') =>
  failures.push({ check, file, line, msg, snippet: String(text).trim().slice(0, 160) });

const cache = new Map();
function load(file) {
  if (!cache.has(file)) {
    const abs = path.join(ROOT, file);
    cache.set(file, existsSync(abs) && statSync(abs).isFile()
      ? readFileSync(abs, 'utf8').replace(/^﻿/, '').split(/\r?\n/)
      : null);
  }
  return cache.get(file);
}
const plain = (s) => s.replace(/\*\*|__|`/g, '');
const windowAt = (lines, i, r = 2) => plain(lines.slice(Math.max(0, i - r), i + r + 1).join(' '));
const insideRoot = (abs) => {
  const r = path.relative(ROOT, abs);
  return r === '' || (!r.startsWith('..') && !path.isAbsolute(r));
};

const docsDir = path.join(ROOT, 'docs');
const docFiles = existsSync(docsDir)
  ? readdirSync(docsDir)
      .filter((n) => n.toLowerCase().endsWith('.md') && statSync(path.join(docsDir, n)).isFile())
      .sort()
      .map((n) => `docs/${n}`)
  : [];
const linkScope = ['README.md', ...docFiles];
const activeDocs = linkScope.filter((f) => !HISTORY.has(f));

// ---------- Markdown link extraction ----------
const INLINE_LINK = /!?\[(?:[^\]\\]|\\.)*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
const REF_DEF = /^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/;

function resolveLink(file, raw) {
  let t = raw.replace(/^<|>$/g, '').trim();
  if (/^[a-z]:[\\/]/i.test(t)) return { abs: null, absolutePath: true };
  if (!t || t.startsWith('#') || t.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(t)) return null;
  t = t.split(/[?#]/)[0];
  if (!t) return null;
  try { t = decodeURIComponent(t); } catch { /* keep raw */ }
  const base = t.startsWith('/') ? ROOT : path.dirname(path.join(ROOT, file));
  return { abs: path.resolve(base, t.replace(/^\/+/, '')) };
}

const linkCache = new Map();
function linksOf(file) {
  if (linkCache.has(file)) return linkCache.get(file);
  const out = [];
  const lines = load(file) ?? [];
  let fence = null;
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(```|~~~)/);
    if (m) { fence = fence === null ? m[1] : fence === m[1] ? null : fence; return; }
    if (fence) return;
    const text = line.replace(/`[^`]*`/g, '');
    const targets = [...text.matchAll(INLINE_LINK)].map((x) => x[1]);
    const ref = text.match(REF_DEF);
    if (ref) targets.push(ref[1]);
    for (const target of targets) {
      const res = resolveLink(file, target);
      if (res) out.push({ line: i + 1, raw: line, target, ...res });
    }
  });
  linkCache.set(file, out);
  return out;
}

// ---------- 1. Canonical norm ----------
const PROJ = /proje[cç](?:[aã]o|[õo]es)|projections?\b/i;
const PREC = /prevalece|prevails?|precedence|preced[eê]ncia|n[aã]o\s+substitui\s+a\s+norma|norma\s+vigente/i;
const archAbs = path.join(ROOT, ARCH);

const arch = load(ARCH);
if (!arch) fail('1-norm', ARCH, 0, 'canonical norm file missing');
else {
  const h1 = arch.findIndex((l) => /^#\s/.test(l));
  if (h1 < 0 || !/v1\.3\b/.test(arch[h1])) fail('1-norm', ARCH, h1 + 1, 'first heading lacks version marker v1.3', arch[h1] ?? '');
}

const readme = load('README.md');
if (!readme) fail('1-norm', 'README.md', 0, 'README.md missing');
else if (!linksOf('README.md').some((l) => l.abs === archAbs && /normativ|\bnorma\b|normative|canonical/i.test(plain(l.raw)))) {
  fail('1-norm', 'README.md', 0, `README does not link ${ARCH} as the normative source`);
}

for (const file of ['README.md', 'docs/03-arquitetura.md']) {
  const lines = load(file);
  if (!lines) { if (file !== 'README.md') fail('1-norm', file, 0, 'summary architecture doc missing'); continue; }
  if (file !== 'README.md' && !linksOf(file).some((l) => l.abs === archAbs)) {
    fail('1-norm', file, 0, `does not link the canonical norm ${ARCH}`);
  }
  if (!lines.some((_, i) => { const w = windowAt(lines, i); return PROJ.test(w) && PREC.test(w); })) {
    fail('1-norm', file, 0, 'missing statement that docs are projections and the v1.3 norm prevails');
  }
}

// ---------- 2. Provider-agnostic markers ----------
const ROLE_RE = /role\s*!=\s*provider|pap[eé]is\s+n[aã]o\s+s[aã]o\s+providers?|papel\s+n[aã]o\s+[ée]\s+provider|roles?\s+(?:are\s+|is\s+)?not\s+(?:a\s+)?providers?/i;
const MULTI_RE = /n[aã]o\s+[ée]\s+(?:inerentemente\s+|necessariamente\s+)?multi-?agent|multi-?agent\S*\s+(?:n[aã]o\s+[ée]\s+obrigat|[ée]\s+opcional|is\s+optional|is\s+not\s+required)|not\s+(?:inherently\s+|necessarily\s+)?multi-?agent|(?:um|a)\s+(?:[úu]nico|single)\s+provider/i;
const MAP_RE = /(?:pap[eé]is|roles?|mapeamento|mapping)[^.\n]{0,80}configur[aá]ve(?:l|is)|configur[aá]ve(?:l|is)[^.\n]{0,40}(?:substitu[ií]ve|pap[eé]is|roles?)|configurable/i;

for (const file of ['README.md', 'docs/03-arquitetura.md', 'docs/04-requisitos.md', 'docs/integrations.md', 'docs/13-governed-bridge.md']) {
  const lines = load(file);
  if (!lines) { fail('2-agnostic', file, 0, 'file missing'); continue; }
  const text = plain(lines.join('\n'));
  if (!ROLE_RE.test(text)) fail('2-agnostic', file, 0, 'missing ROLE != PROVIDER marker');
  if (!MULTI_RE.test(text) && !MAP_RE.test(text)) {
    fail('2-agnostic', file, 0, 'missing marker that multi-agent is not mandatory / provider mapping is configurable');
  }
}

// ---------- 3. Autonomy requirements (PLANNED) ----------
const AUTONOMY_FILES = ['README.md', 'docs/01-produto.md', 'docs/03-arquitetura.md', 'docs/04-requisitos.md', 'docs/integrations.md'];
const PLANNED_RE = /\bPLANNED\b|\btarget\b|\balvo\b|planejad|n[aã]o\s+(?:est[aá]\s+)?(?:comprovad|provad)|ainda\s+n[aã]o|not\s+(?:yet\s+)?proven|unproven/i;

for (const token of ['AUTO_CONTINUE_WHILE_AUTHORIZED', 'USER_INTENT_CAN_DRIVE_MULTI_TASK_WORKFLOW']) {
  let seen = 0;
  for (const file of AUTONOMY_FILES) {
    const lines = load(file);
    if (!lines) continue;
    lines.forEach((line, i) => {
      if (!line.includes(token)) return;
      seen++;
      if (!PLANNED_RE.test(windowAt(lines, i, 3))) {
        fail('3-autonomy', file, i + 1, `${token} not explicitly marked PLANNED/target/not yet proven`, line);
      }
    });
  }
  if (!seen) fail('3-autonomy', AUTONOMY_FILES.join(','), 0, `${token} not documented as a requirement`);
}

// ---------- 4. Forbidden current-identity terminology ----------
// Identity terms are assembled from fragments so this checker does not self-match in public tree audits.
const ID_CLIENT = ['Cli', 'ent'].join('');
const ID_UNITY = ['Un', 'ity'].join('');
const ID_TRELLO = ['Tre', 'llo'].join('');
const NEG = /(?<![\p{L}\p{N}])(?:(?:sem|n[aã]o|nunca|nenhum|nenhuma|not|never|without|formerly|anteriormente|exceto)(?![\p{L}\p{N}])|removid|removed|retired|aposentad|superseded|substitu[ií]d|deprecated|descontinuad|obsolet|legad|legacy|hist[oó]ric|fora\s+do\s+escopo|out\s+of\s+scope)/iu;
const FORBIDDEN = [
  ['Free/Pro/Enterprise plan', /\b(?:free|pro|enterprise)\s+(?:plans?|planos?|tiers?)\b|\bplanos?\s+(?:free|pro|enterprise)\b|\bfree\s*\/\s*pro\s*\/\s*enterprise\b/i],
  ['subscription model', /\bsubscriptions?\s+(?:plans?|models?|tiers?|billing)\b|\bsubscription-based\b|modelo\s+de\s+assinatura|assinatura\s+(?:paga|mensal|anual)/i],
  ['paid engine', /\bpaid\s+engine\b|\bengine\s+pag[oa]\b|open-core\s+comercial|commercial\s+open-core/i],
  ['SaaS core', /\bSaaS\s+core\b|\bcore\s+SaaS\b|n[uú]cleo\s+SaaS|\bSaaS\s+(?:product|produto|platform|plataforma)\b/i],
  ['Forjavia Cloud', /\bForjavia\s+Cloud\b/i],
  ['Cloudflare deployment as core', /cloudflare[^.\n]{0,60}(?:core|n[uú]cleo|deploy|implanta|hosting|hospedagem)|(?:deploy(?:ment)?|implanta[cç][aã]o|hosting|hospedagem)[^.\n]{0,60}cloudflare/i],
  ['MU Online identity', /\bMU\s*Online\b[^.\n]{0,60}(?:core|identi|n[uú]cleo|produto|product|servidor|server)|(?:forjavia|core|identi|n[uú]cleo|produto|product)[^.\n]{0,60}\bMU\s*Online\b/i],
  [`${ID_CLIENT} ${ID_UNITY} identity`, new RegExp(`\\b${ID_CLIENT}\\s+${ID_UNITY}\\b|\\b${ID_UNITY}\\s+${ID_CLIENT.toLowerCase()}\\b[^.\\n]{0,60}(?:core|identi|n[uú]cleo|produto|product)`, 'i')],
  [`${ID_TRELLO} operational architecture`, new RegExp(`\\b${ID_TRELLO.toLowerCase()}\\b[^.\\n]{0,60}(?:board|quadro|sync|sincroni|operacion|operational|source\\s+of\\s+truth|integra)|(?:integra[cç][aã]o|integration|sync|sincroniza|board|quadro|operacion|operational)[^.\\n]{0,60}\\b${ID_TRELLO.toLowerCase()}\\b`, 'i')],
];

for (const file of activeDocs) {
  (load(file) ?? []).forEach((line, i) => {
    const text = plain(line);
    if (NEG.test(text)) return;
    for (const [label, re] of FORBIDDEN) {
      if (re.test(text)) fail('4-terminology', file, i + 1, `forbidden current identity/direction: ${label}`, line);
    }
  });
}

// ---------- 5. Local Markdown links ----------
for (const file of linkScope) {
  for (const l of linksOf(file)) {
    if (l.absolutePath) fail('5-links', file, l.line, `absolute filesystem link not allowed: ${l.target}`, l.raw);
    else if (!insideRoot(l.abs)) fail('5-links', file, l.line, `link escapes repo root: ${l.target}`, l.raw);
    else if (!existsSync(l.abs)) fail('5-links', file, l.line, `local link target missing: ${l.target}`, l.raw);
  }
}

// ---------- 6. No universal provider roles ----------
const ROLE_TOKEN = /CODEX_IS_ORCHESTRATOR_ONLY|CLAUDE_CODE_PRIMARY_WORKER/;
const NONNORM = /n[aã]o\s+(?:[ée]\s+)?normativ|non-?normative|not\s+normative|perfil\s+(?:local|experimental|do\s+ambiente)|local\s+profile|experimental|n[aã]o\s+[ée]\s+(?:regra|requisito|invariante)|not\s+(?:a\s+)?(?:rule|requirement|invariant)|exemplo|example/i;
const PROSE_UNIVERSAL = [
  /claude[^.\n]{0,60}(?:obrigat[oó]ri|mandat[oó]ri|required|exigid|mandatory)/i,
  /codex[^.\n]{0,40}(?:sempre|always|[úu]nico|only)[^.\n]{0,30}(?:orchestrat|orquestrad)/i,
];

for (const file of activeDocs) {
  const lines = load(file) ?? [];
  lines.forEach((line, i) => {
    const text = plain(line);
    const w = windowAt(lines, i, 3);
    if (ROLE_TOKEN.test(text) && !NONNORM.test(w) && !NEG.test(text)) {
      fail('6-provider-roles', file, i + 1, 'provider-role token used without non-normative/local-profile marking', line);
    } else if (PROSE_UNIVERSAL.some((re) => re.test(text)) && !NEG.test(text) && !NONNORM.test(w)) {
      fail('6-provider-roles', file, i + 1, 'provider presented as universal/mandatory role', line);
    }
  });
}

// ---------- Report ----------
if (failures.length === 0) {
  console.log('PASS');
} else {
  for (const f of failures) {
    console.error(`FAIL [${f.check}] ${f.file}${f.line ? `:${f.line}` : ''} - ${f.msg}${f.snippet ? ` | ${f.snippet}` : ''}`);
  }
  console.error(`public-docs-check: ${failures.length} failure(s)`);
  process.exitCode = 1;
}
