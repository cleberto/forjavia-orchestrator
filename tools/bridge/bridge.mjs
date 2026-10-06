#!/usr/bin/env node
// Local, sequential, fail-closed Codex → Claude bridge. No provider SDK dependency.
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const MAX_SAME_FAILURE_RETRIES = 2;
const ACTIONS = new Set(["CONTINUE", "RETRY", "OWNER_REQUIRED", "STOP"]);
const SHA = /^[A-F0-9]{64}$/;
const ID = /^[A-Z0-9][A-Z0-9_-]{5,100}$/;
const PLACEHOLDER = /<[^>]+>|%[A-Z_][A-Z0-9_]*%|\$\{[^}]+\}/i;
const RESULT_SCHEMA = {
  type: "object", additionalProperties: false,
  properties: {
    execution_id: { type: "string" },
    status: { type: "string", enum: ["COMPLETE", "FAILED", "OWNER_REQUIRED"] },
    artifact_content: { type: "string" },
    evidence: { type: "array", items: { type: "string" } },
    findings: { type: "array", items: { type: "string" } },
    requested_action: { type: "string", enum: ["ADJUDICATE"] }
  },
  required: ["execution_id", "status", "evidence", "findings", "requested_action"]
};

export function sha(bytes) { return createHash("sha256").update(bytes).digest("hex").toUpperCase(); }
export function fail(code, detail = "") { const error = new Error(detail || code); error.code = code; throw error; }
function json(file) { return JSON.parse(readFileSync(file, "utf8")); }
function own(o, key) { return Object.prototype.hasOwnProperty.call(o, key); }
function exactKeys(o, keys) {
  if (!o || typeof o !== "object" || Array.isArray(o) || Object.keys(o).some(k => !keys.includes(k)))
    fail("SCHEMA_INVALID");
}
function guardedRel(value) {
  if (typeof value !== "string" || !value || path.isAbsolute(value) ||
      value.includes("\\") || value.includes(":") ||
      value.split("/").some(s => !s || s === "." || s === "..") ||
      PLACEHOLDER.test(value) || /[\x00-\x1f]/.test(value)) fail("PATH_INVALID", String(value));
  if (value.split("/").some(s => [".git", ".claude", "evidence"].includes(s.toLowerCase())))
    fail("PATH_FORBIDDEN", value);
  const abs = path.resolve(ROOT, value);
  if (!abs.startsWith(ROOT + path.sep)) fail("PATH_BOUNDARY", value);
  let ancestor = abs;
  while (!existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const realRoot = realpathSync.native(ROOT);
  const realAncestor = realpathSync.native(ancestor);
  if (realAncestor !== realRoot && !realAncestor.startsWith(realRoot + path.sep))
    fail("PATH_BOUNDARY", value);
  return abs;
}
function existingFile(rel, expected) {
  if (!SHA.test(expected)) fail("HASH_INVALID");
  const abs = guardedRel(rel);
  if (!existsSync(abs) || !statSync(abs).isFile()) fail("REFERENCE_MISSING", rel);
  // Refuse symlink escapes, including parent-directory junctions.
  if (!realpathSync.native(abs).startsWith(realpathSync.native(ROOT) + path.sep)) fail("PATH_BOUNDARY", rel);
  if (sha(readFileSync(abs)) !== expected) fail("HASH_MISMATCH", rel);
  return abs;
}
function noSelfOrForward(o, ownHash, forbiddenHashes) {
  const body = JSON.stringify(o).toUpperCase();
  if (body.includes(ownHash)) fail("SELF_HASH");
  for (const h of forbiddenHashes) if (h && body.includes(h)) fail("FORWARD_HASH");
}
export function validate(action, authority, authorityHash) {
  exactKeys(action, ["execution_id", "action", "executor", "task_ref", "task_sha256",
    "authority_ref", "authority_sha256", "context_refs", "expected_outputs"]);
  exactKeys(authority, ["execution_id", "scope", "single_use", "executor", "task_ref",
    "task_sha256", "context_refs", "allowed_outputs", "max_changed_files",
    "max_material_units", "allow_provider_invocation", "authority_kind"]);
  if (!ID.test(action.execution_id) || action.execution_id !== authority.execution_id)
    fail("AUTHORITY_BLOCK:EXECUTION_ID");
  if (!ACTIONS.has(action.action) || action.executor !== "claude" || authority.executor !== "claude")
    fail("SCHEMA_INVALID");
  if (action.authority_sha256 !== authorityHash || action.task_ref !== authority.task_ref ||
      action.task_sha256 !== authority.task_sha256 ||
      JSON.stringify(action.context_refs) !== JSON.stringify(authority.context_refs) ||
      JSON.stringify(action.expected_outputs) !== JSON.stringify(authority.allowed_outputs))
    fail("AUTHORITY_BLOCK:BINDING");
  if (authority.scope !== "FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION" ||
      authority.authority_kind !== "LOCAL_GOVERNED_BRIDGE" ||
      authority.single_use !== true || typeof authority.allow_provider_invocation !== "boolean")
    fail("AUTHORITY_BLOCK:SCOPE");
  if (!Number.isInteger(authority.max_changed_files) || authority.max_changed_files < 0 ||
      authority.max_changed_files > 5 || !Number.isInteger(authority.max_material_units) ||
      authority.max_material_units < 0 || authority.max_material_units > 5)
    fail("BUDGET_EXCEEDED");
  if (!Array.isArray(action.expected_outputs) || action.expected_outputs.length > authority.max_changed_files ||
      action.expected_outputs.length > 1 || new Set(action.expected_outputs).size !== action.expected_outputs.length)
    fail("BUDGET_EXCEEDED");
  // The runner itself creates state, result and adjudication records. Reserve
  // all three in the governed-wave file budget before invoking a provider.
  if (action.expected_outputs.length + 3 > authority.max_changed_files)
    fail("BUDGET_EXCEEDED");
  for (const rel of action.expected_outputs) {
    const abs = guardedRel(rel);
    if (existsSync(abs)) fail("CREATE_ONLY_VIOLATION", rel);
  }
  existingFile(action.task_ref, action.task_sha256);
  if (!Array.isArray(action.context_refs) || action.context_refs.length > 3) fail("CONTEXT_BUDGET");
  for (const ref of action.context_refs) {
    exactKeys(ref, ["path", "sha256"]);
    existingFile(ref.path, ref.sha256);
  }
  if (action.action === "CONTINUE" || action.action === "RETRY") {
    if (!authority.allow_provider_invocation) fail("AUTHORITY_BLOCK:PROVIDER");
  } else if (action.expected_outputs.length) fail("AUTHORITY_BLOCK:OUTPUT");
  noSelfOrForward(authority, authorityHash, []);
}
export function compileContext(action) {
  const task = readFileSync(guardedRel(action.task_ref), "utf8");
  if (task.length > 16000) fail("CONTEXT_BUDGET");
  const context = action.context_refs.map(ref => {
    const data = readFileSync(guardedRel(ref.path), "utf8");
    if (data.length > 12000) fail("CONTEXT_BUDGET");
    return { path: ref.path, sha256: ref.sha256, content: data };
  });
  return JSON.stringify({ execution_id: action.execution_id, task, context,
    expected_outputs: action.expected_outputs,
    instruction: "Return only structured JSON. Do not invoke tools or mutate files. If an output is requested, provide its complete UTF-8 content as artifact_content. Report findings accurately." });
}
export function validateExecutorResult(value, executionId, outputCount) {
  exactKeys(value, Object.keys(RESULT_SCHEMA.properties));
  if (value.execution_id !== executionId || !["COMPLETE", "FAILED", "OWNER_REQUIRED"].includes(value.status) ||
      value.requested_action !== "ADJUDICATE" || !Array.isArray(value.evidence) ||
      !Array.isArray(value.findings) || value.evidence.some(x => typeof x !== "string") ||
      value.findings.some(x => typeof x !== "string")) fail("EXECUTOR_RESULT_INVALID");
  if (value.status === "COMPLETE" && outputCount === 1 &&
      (typeof value.artifact_content !== "string" || !value.artifact_content))
    fail("EXECUTOR_RESULT_INVALID");
  if (outputCount === 0 && own(value, "artifact_content")) fail("EXECUTOR_RESULT_INVALID");
}
export function resolveClaudeExecutable(env = process.env) {
  if (env.CLAUDE_EXECUTABLE) return env.CLAUDE_EXECUTABLE;
  for (const dir of (env.PATH || env.Path || "").split(path.delimiter)) {
    if (!dir) continue;
    for (const candidate of process.platform === "win32"
      ? [path.join(dir, "claude.exe"),
         path.join(dir, "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe")]
      : [path.join(dir, "claude")]) {
      if (existsSync(candidate)) return candidate;
    }
  }
  fail("PROVIDER_EXECUTABLE_NOT_FOUND");
}
async function claude(prompt) {
  const exe = resolveClaudeExecutable();
  const args = ["-p", "--output-format", "json", "--json-schema", JSON.stringify(RESULT_SCHEMA),
    "--permission-mode", "dontAsk", "--permission-prompts", "none",
    "--tools", "", "--restricted", "--strict-mcp-config",
    "--disable-slash-commands", "--no-session-persistence", prompt];
  return new Promise((resolve, reject) => {
    const child = spawn(exe, args, { cwd: ROOT, shell: false, windowsHide: true,
      env: { ...process.env, CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1" } });
    let out = "", err = "";
    child.stdout.on("data", b => { out += b; if (out.length > 1_000_000) child.kill(); });
    child.stderr.on("data", b => { err += b; if (err.length > 200_000) child.kill(); });
    child.on("error", reject);
    child.on("close", code => {
      if (code !== 0) return reject(Object.assign(new Error(err.slice(-2000) || `Claude exit ${code}`),
        { code: "PROVIDER_FAILURE" }));
      try {
        const envelope = JSON.parse(out);
        resolve(envelope.structured_output ?? JSON.parse(envelope.result));
      } catch { reject(Object.assign(new Error("No machine-readable Claude result"), { code: "PROVIDER_RESULT_INVALID" })); }
    });
  });
}
function writeNew(rel, bytes) {
  const abs = guardedRel(rel);
  if (existsSync(abs)) fail("CREATE_ONLY_VIOLATION", rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, bytes, { flag: "wx" });
  return sha(bytes);
}
function statePaths(id) {
  const dir = `runtime/bridge/${id}`;
  return { state: `${dir}/state.json`, result: `${dir}/result.json`,
    failure: `${dir}/failure-learning.json`, adjudication: `${dir}/adjudication.json` };
}
export function nextForFailure(previous, failureClass, executionId) {
  const last = previous?.latest_result ?? previous;
  const same = last?.error_class === failureClass || last?.failure_class === failureClass
    ? (last.same_failure_count ?? 0) + 1 : 1;
  const stopped = same >= MAX_SAME_FAILURE_RETRIES;
  return { execution_id: executionId, failure_class: failureClass, same_failure_count: same,
    next_action: stopped ? "STOP" : "RETRY",
    failure_learning_packet: stopped ? {
      execution_id: executionId, failure_class: failureClass,
      lesson_candidate: "Promote repeatable mechanical failures to deterministic validation",
      requirement: "A materially different plan is required before continuation"
    } : null };
}
export async function run(actionRel, executor = claude) {
  const actionAbs = guardedRel(actionRel), action = json(actionAbs);
  const authorityAbs = guardedRel(action.authority_ref);
  const authorityBytes = readFileSync(authorityAbs);
  const authorityHash = sha(authorityBytes);
  const authority = JSON.parse(authorityBytes);
  validate(action, authority, authorityHash);
  const paths = statePaths(action.execution_id);
  if (existsSync(guardedRel(paths.result))) fail("AUTHORITY_CONSUMED");
  const previous = existsSync(guardedRel(paths.state)) ? json(guardedRel(paths.state)) : null;
  if (previous?.next_action === "STOP" || previous?.next_action === "OWNER_REQUIRED")
    fail("AUTHORITY_BLOCK:TERMINAL_STATE");
  if (action.action === "RETRY" && previous?.next_action !== "RETRY") fail("RETRY_NOT_AUTHORIZED");
  if (action.action === "CONTINUE" && previous?.next_action === "RETRY") fail("RETRY_REQUIRED");
  const actionHash = sha(readFileSync(actionAbs));
  const base = { execution_id: action.execution_id, authority_sha256: authorityHash,
    action_sha256: actionHash, task_sha256: action.task_sha256 };
  let result;
  if (action.action === "OWNER_REQUIRED" || action.action === "STOP") {
    result = { ...base, status: action.action, requested_action: action.action, provider_invoked: false };
  } else {
    try {
      const response = await executor(compileContext(action));
      validateExecutorResult(response, action.execution_id, action.expected_outputs.length);
      const artifact = response.status === "COMPLETE" && action.expected_outputs.length
        ? { path: action.expected_outputs[0], sha256: writeNew(action.expected_outputs[0],
          Buffer.from(response.artifact_content, "utf8")) } : null;
      result = { ...base, status: response.status, requested_action: response.requested_action,
        provider_invoked: true, artifact, evidence: response.evidence, findings: response.findings };
    } catch (error) {
      const failure = nextForFailure(previous, error.code || "EXECUTOR_FAILURE", action.execution_id);
      result = { ...base, status: "FAILED", provider_invoked: true,
        error_class: failure.failure_class, requested_action: failure.next_action,
        same_failure_count: failure.same_failure_count };
      if (failure.failure_learning_packet)
        writeNew(paths.failure, Buffer.from(JSON.stringify(failure.failure_learning_packet, null, 2) + "\n"));
    }
  }
  const state = { ...base, current_objective: authority.scope, current_execution: action.execution_id,
    latest_result: result, retry_state: result.same_failure_count ?? 0,
    next_action: result.requested_action, failure_packet: existsSync(guardedRel(paths.failure)) ? paths.failure : null };
  const stateAbs = guardedRel(paths.state);
  mkdirSync(path.dirname(stateAbs), { recursive: true });
  writeFileSync(stateAbs, JSON.stringify(state, null, 2) + "\n");
  if (result.requested_action !== "RETRY") writeNew(paths.result, Buffer.from(JSON.stringify(result, null, 2) + "\n"));
  return result;
}
export function adjudicate(executionId) {
  if (!ID.test(executionId)) fail("REVIEW_TARGET_INVALID");
  const paths = statePaths(executionId);
  if (existsSync(guardedRel(paths.adjudication))) fail("CREATE_ONLY_VIOLATION");
  if (!existsSync(guardedRel(paths.result))) fail("RESULT_MISSING");
  const resultBytes = readFileSync(guardedRel(paths.result));
  const result = JSON.parse(resultBytes);
  const state = json(guardedRel(paths.state));
  if (result.execution_id !== executionId || state.current_execution !== executionId ||
      state.latest_result.action_sha256 !== result.action_sha256 ||
      state.latest_result.authority_sha256 !== result.authority_sha256)
    fail("WRONG_REVIEW_TARGET");
  let verifiedArtifact = null;
  if (result.artifact) {
    const abs = guardedRel(result.artifact.path);
    if (!existsSync(abs) || sha(readFileSync(abs)) !== result.artifact.sha256)
      fail("EVIDENCE_BINDING_MISMATCH");
    verifiedArtifact = result.artifact;
  }
  const pass = result.status === "COMPLETE" && Array.isArray(result.evidence) &&
    result.evidence.length > 0 && result.requested_action === "ADJUDICATE";
  const decision = { execution_id: executionId, result_sha256: sha(resultBytes),
    authority_sha256: result.authority_sha256, verdict: pass ? "PASS" : "BLOCK",
    next_action: pass ? "CONTINUE" : "STOP", verified_artifact: verifiedArtifact,
    authority_consumed: true };
  writeNew(paths.adjudication, Buffer.from(JSON.stringify(decision, null, 2) + "\n"));
  return decision;
}
export function recover(executionId) {
  if (!ID.test(executionId)) fail("REVIEW_TARGET_INVALID");
  const paths = statePaths(executionId);
  if (!existsSync(guardedRel(paths.state))) fail("STATE_MISSING");
  const state = json(guardedRel(paths.state));
  if (state.current_execution !== executionId) fail("WRONG_REVIEW_TARGET");
  const adjudication = existsSync(guardedRel(paths.adjudication))
    ? json(guardedRel(paths.adjudication)) : null;
  const failurePacket = existsSync(guardedRel(paths.failure))
    ? json(guardedRel(paths.failure)) : null;
  return { current_objective: state.current_objective, current_execution: executionId,
    authority_sha256: state.authority_sha256, latest_result: state.latest_result,
    latest_adjudication: adjudication, retry_state: state.retry_state,
    failure_packet: failurePacket,
    next_action: adjudication?.next_action ?? state.next_action };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  (process.argv[2] === "adjudicate" ? Promise.resolve(adjudicate(process.argv[3])) :
    process.argv[2] === "recover" ? Promise.resolve(recover(process.argv[3])) :
    run(process.argv[2])).then(r => { process.stdout.write(JSON.stringify(r) + "\n"); },
    e => { process.stderr.write(`${e.code || "BRIDGE_ERROR"}: ${e.message}\n`); process.exitCode = 1; });
}
