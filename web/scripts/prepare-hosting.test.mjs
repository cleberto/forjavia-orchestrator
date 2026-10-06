import test from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prepareHosting } from "./prepare-hosting.mjs";

test("clean checkout creates exact local hosting bytes and never overwrites", () => {
  const tempBase = path.resolve(tmpdir());
  const scratch = mkdtempSync(path.join(tempBase, "forjavia-hosting-"));
  try {
    mkdirSync(path.join(scratch, "config"));
    const template = fileURLToPath(new URL("../config/hosting.bootstrap.json", import.meta.url));
    copyFileSync(template, path.join(scratch, "config", "hosting.bootstrap.json"));
    const expected = readFileSync(template);
    const first = prepareHosting(scratch);
    assert.equal(first.created, true);
    assert.deepEqual(readFileSync(first.path), expected);
    writeFileSync(first.path, "pre-existing local configuration");
    const second = prepareHosting(scratch);
    assert.equal(second.created, false);
    assert.equal(readFileSync(first.path, "utf8"), "pre-existing local configuration");
  } finally {
    if (!scratch.startsWith(tempBase + path.sep)) throw new Error("unsafe test cleanup");
    rmSync(scratch, { recursive: true, force: true });
  }
});

test("missing template fails without creating hosting state", () => {
  const tempBase = path.resolve(tmpdir());
  const scratch = mkdtempSync(path.join(tempBase, "forjavia-hosting-"));
  try {
    assert.throws(() => prepareHosting(scratch));
    assert.equal(existsSync(path.join(scratch, ".openai", "hosting.json")), false);
  } finally {
    if (!scratch.startsWith(tempBase + path.sep)) throw new Error("unsafe test cleanup");
    rmSync(scratch, { recursive: true, force: true });
  }
});
