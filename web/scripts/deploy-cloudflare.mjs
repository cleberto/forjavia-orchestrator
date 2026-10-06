import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function run(script, args) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), ...args], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("./run-framework.mjs", ["build"]);
const workerConfigPath = fileURLToPath(new URL("../dist/server/wrangler.json", import.meta.url));
const databaseConfigPath = fileURLToPath(new URL("../cloudflare.d1.json", import.meta.url));
const workerConfig = JSON.parse(readFileSync(workerConfigPath, "utf8"));
const databaseConfig = JSON.parse(readFileSync(databaseConfigPath, "utf8"));
workerConfig.d1_databases = [databaseConfig];
writeFileSync(workerConfigPath, JSON.stringify(workerConfig));

run("../node_modules/wrangler/bin/wrangler.js", [
  "d1", "migrations", "apply", "DB", "--remote", "--config", "dist/server/wrangler.json",
]);
run("../node_modules/wrangler/bin/wrangler.js", [
  "deploy",
  "--config",
  "dist/server/wrangler.json",
  "--name",
  "forjavia",
]);
