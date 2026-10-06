import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const TEMPLATE_PATH = ['config', 'hosting.bootstrap.json'];
const TARGET_PATH = ['.openai', 'hosting.json'];
const REQUIRED_KEYS = ['d1', 'project_id', 'r2'];

function isNullOrString(value) {
  return value === null || typeof value === 'string';
}

function validateTemplate(bytes) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('hosting template is not valid UTF-8');
  }

  let parsed;
  try {
    parsed = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
  } catch {
    throw new Error('hosting template is not valid JSON');
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('hosting template must be a JSON object');
  }

  const keys = Object.keys(parsed).sort();
  if (keys.length !== REQUIRED_KEYS.length || keys.some((key, i) => key !== REQUIRED_KEYS[i])) {
    throw new Error('hosting template must have exactly the keys d1, r2, project_id');
  }
  if (!isNullOrString(parsed.d1)) {
    throw new Error('hosting template key d1 must be null or a string');
  }
  if (!isNullOrString(parsed.r2)) {
    throw new Error('hosting template key r2 must be null or a string');
  }
  if (typeof parsed.project_id !== 'string') {
    throw new Error('hosting template key project_id must be a string');
  }
}

export function prepareHosting(root = DEFAULT_ROOT) {
  const base = resolve(root);
  const templatePath = join(base, ...TEMPLATE_PATH);
  const targetPath = join(base, ...TARGET_PATH);

  const bytes = readFileSync(templatePath);
  validateTemplate(bytes);

  if (existsSync(targetPath)) {
    return { created: false, path: targetPath };
  }

  mkdirSync(dirname(targetPath), { recursive: true });

  try {
    writeFileSync(targetPath, bytes, { flag: 'wx' });
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      return { created: false, path: targetPath };
    }
    throw error;
  }

  return { created: true, path: targetPath };
}

function isCli() {
  if (!process.argv[1]) return false;
  try {
    const invoked = pathToFileURL(realpathSync(process.argv[1])).href;
    const self = pathToFileURL(realpathSync(fileURLToPath(import.meta.url))).href;
    return invoked === self;
  } catch {
    return false;
  }
}

if (isCli()) {
  try {
    const { created } = prepareHosting();
    console.log(created ? 'hosting.json: created' : 'hosting.json: existing');
  } catch (error) {
    console.error(`prepare-hosting failed: ${error && error.message ? error.message : 'unknown error'}`);
    process.exitCode = 1;
  }
}
