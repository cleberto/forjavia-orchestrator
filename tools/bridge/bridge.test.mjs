import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ROOT, sha, validate, run, nextForFailure } from "./bridge.mjs";

test("L1 schema, authority, and budgets fail closed", () => {
  const authority = { execution_id: "BRIDGE-TEST-000001", scope: "FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION",
    single_use: true, executor: "claude", task_ref: "task.md", task_sha256: "A".repeat(64),
    context_refs: [], allowed_outputs: [], max_changed_files: 5, max_material_units: 5,
    allow_provider_invocation: false, authority_kind: "LOCAL_GOVERNED_BRIDGE" };
  const action = { execution_id: authority.execution_id, action: "CONTINUE", executor: "claude",
    task_ref: authority.task_ref, task_sha256: authority.task_sha256, authority_ref: "auth.json",
    authority_sha256: "B".repeat(64), context_refs: [], expected_outputs: [] };
  assert.throws(() => validate(action, authority, "B".repeat(64)),
    { code: "REFERENCE_MISSING" });
  const wrong = { ...action, execution_id: "BRIDGE-TEST-WRONG" };
  assert.throws(() => validate(wrong, authority, "B".repeat(64)),
    { code: "AUTHORITY_BLOCK:EXECUTION_ID" });
  const over = { ...authority, max_material_units: 6 };
  assert.throws(() => validate(action, over, "B".repeat(64)), { code: "BUDGET_EXCEEDED" });
});

test("L2 fake executor returns persisted structured evidence, denies reuse and unauthorized invocation", async () => {
  const id = "BRIDGE-TEST-" + randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
  const dir = path.join(ROOT, "runtime", "bridge", id);
  const rel = s => `runtime/bridge/${id}/${s}`;
  mkdirSync(dir, { recursive: true });
  try {
    const task = Buffer.from("Write one local marker.", "utf8");
    writeFileSync(path.join(dir, "task.md"), task);
    const authority = { execution_id: id, scope: "FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION",
      single_use: true, executor: "claude", task_ref: rel("task.md"), task_sha256: sha(task),
      context_refs: [], allowed_outputs: [rel("marker.txt")], max_changed_files: 5,
      max_material_units: 1, allow_provider_invocation: true, authority_kind: "LOCAL_GOVERNED_BRIDGE" };
    const authBytes = Buffer.from(JSON.stringify(authority));
    writeFileSync(path.join(dir, "authority.json"), authBytes);
    const action = { execution_id: id, action: "CONTINUE", executor: "claude",
      task_ref: authority.task_ref, task_sha256: authority.task_sha256,
      authority_ref: rel("authority.json"), authority_sha256: sha(authBytes),
      context_refs: [], expected_outputs: authority.allowed_outputs };
    writeFileSync(path.join(dir, "action.json"), JSON.stringify(action));
    let calls = 0;
    const fake = async prompt => {
      calls++;
      assert.match(prompt, /Write one local marker/);
      return { execution_id: id, status: "COMPLETE", artifact_content: "fake output\n",
        evidence: ["fake executor"], findings: [], requested_action: "ADJUDICATE" };
    };
    const result = await run(rel("action.json"), fake);
    assert.equal(result.artifact.sha256, sha(Buffer.from("fake output\n")));
    assert.equal(readFileSync(path.join(dir, "marker.txt"), "utf8"), "fake output\n");
    assert.equal(JSON.parse(readFileSync(path.join(dir, "state.json"))).next_action, "ADJUDICATE");
    await assert.rejects(run(rel("action.json"), fake), { code: "CREATE_ONLY_VIOLATION" });
    assert.equal(calls, 1);
    const unauthorized = { ...authority, allowed_outputs: [], allow_provider_invocation: false };
    const unauthorizedHash = sha(Buffer.from(JSON.stringify(unauthorized)));
    assert.throws(() => validate({ ...action, authority_sha256: unauthorizedHash,
      expected_outputs: [] }, unauthorized, unauthorizedHash), { code: "AUTHORITY_BLOCK:PROVIDER" });
  } finally {
    if (!dir.startsWith(path.join(ROOT, "runtime", "bridge") + path.sep)) throw new Error("unsafe test cleanup");
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
});

test("same failure twice stops and produces scoped learning candidate", () => {
  const first = nextForFailure(null, "VALIDATOR_FAILED", "BRIDGE-TEST-RETRY");
  assert.equal(first.next_action, "RETRY");
  const second = nextForFailure({ failure_class: first.failure_class,
    same_failure_count: first.same_failure_count }, "VALIDATOR_FAILED", "BRIDGE-TEST-RETRY");
  assert.equal(second.next_action, "STOP");
  assert.equal(second.failure_learning_packet.execution_id, "BRIDGE-TEST-RETRY");
});

test("persisted retry state stops the same failure after two attempts", async () => {
  const id = "BRIDGE-TEST-" + randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
  const dir = path.join(ROOT, "runtime", "bridge", id);
  const rel = s => `runtime/bridge/${id}/${s}`;
  mkdirSync(dir, { recursive: true });
  try {
    const task = Buffer.from("Exercise retry persistence.", "utf8");
    writeFileSync(path.join(dir, "task.md"), task);
    const authority = { execution_id: id, scope: "FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION",
      single_use: true, executor: "claude", task_ref: rel("task.md"), task_sha256: sha(task),
      context_refs: [], allowed_outputs: [], max_changed_files: 3, max_material_units: 1,
      allow_provider_invocation: true, authority_kind: "LOCAL_GOVERNED_BRIDGE" };
    const authBytes = Buffer.from(JSON.stringify(authority));
    writeFileSync(path.join(dir, "authority.json"), authBytes);
    const action = { execution_id: id, action: "CONTINUE", executor: "claude",
      task_ref: rel("task.md"), task_sha256: sha(task), authority_ref: rel("authority.json"),
      authority_sha256: sha(authBytes), context_refs: [], expected_outputs: [] };
    writeFileSync(path.join(dir, "action.json"), JSON.stringify(action));
    let calls = 0;
    const failing = async () => { calls++; throw Object.assign(new Error("repeat"), { code: "SAME_FAILURE" }); };
    const first = await run(rel("action.json"), failing);
    assert.equal(first.requested_action, "RETRY");
    assert.equal(first.same_failure_count, 1);
    writeFileSync(path.join(dir, "action.json"), JSON.stringify({ ...action, action: "RETRY" }));
    const second = await run(rel("action.json"), failing);
    assert.equal(second.requested_action, "STOP");
    assert.equal(second.same_failure_count, 2);
    assert.equal(JSON.parse(readFileSync(path.join(dir, "failure-learning.json"))).execution_id, id);
    await assert.rejects(run(rel("action.json"), failing), { code: "AUTHORITY_CONSUMED" });
    assert.equal(calls, 2);
  } finally {
    if (!dir.startsWith(path.join(ROOT, "runtime", "bridge") + path.sep)) throw new Error("unsafe test cleanup");
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
});

test("OWNER_REQUIRED persists terminal state without provider invocation", async () => {
  const id = "BRIDGE-TEST-" + randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
  const dir = path.join(ROOT, "runtime", "bridge", id);
  const rel = s => `runtime/bridge/${id}/${s}`;
  mkdirSync(dir, { recursive: true });
  try {
    const task = Buffer.from("Request a genuine scope decision.", "utf8");
    writeFileSync(path.join(dir, "task.md"), task);
    const authority = { execution_id: id, scope: "FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION",
      single_use: true, executor: "claude", task_ref: rel("task.md"), task_sha256: sha(task),
      context_refs: [], allowed_outputs: [], max_changed_files: 3, max_material_units: 0,
      allow_provider_invocation: false, authority_kind: "LOCAL_GOVERNED_BRIDGE" };
    const authBytes = Buffer.from(JSON.stringify(authority));
    writeFileSync(path.join(dir, "authority.json"), authBytes);
    writeFileSync(path.join(dir, "action.json"), JSON.stringify({
      execution_id: id, action: "OWNER_REQUIRED", executor: "claude", task_ref: rel("task.md"),
      task_sha256: sha(task), authority_ref: rel("authority.json"),
      authority_sha256: sha(authBytes), context_refs: [], expected_outputs: [] }));
    const result = await run(rel("action.json"), async () => { throw new Error("provider must not run"); });
    assert.equal(result.requested_action, "OWNER_REQUIRED");
    assert.equal(result.provider_invoked, false);
    assert.equal(JSON.parse(readFileSync(path.join(dir, "state.json"))).next_action, "OWNER_REQUIRED");
  } finally {
    if (!dir.startsWith(path.join(ROOT, "runtime", "bridge") + path.sep)) throw new Error("unsafe test cleanup");
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
});
