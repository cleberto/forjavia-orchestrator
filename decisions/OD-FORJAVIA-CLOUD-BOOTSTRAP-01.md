# OD-FORJAVIA-CLOUD-BOOTSTRAP-01 — Cloud Bootstrap Authority

Decision version: 1
Type: SINGLE_USE execution authority
Gate: `CLOUD_BOOTSTRAP_AND_CONTINUATION_SETUP`
Precedence: `architecture > active authority > versioned state > handoff`. Unresolved conflict → `STOP`.

## 1. Authority terms

- `OWNER_AUTHORIZED=TRUE`
- `SINGLE_USE=TRUE`
- `AUTHORITY_STATUS=ACTIVE_NOT_CONSUMED`
- `EXECUTION_ID=CLOUD-BOOTSTRAP-EXEC-01`
- `SCOPE=CLOUD_BOOTSTRAP_AND_CONTINUATION_SETUP`

Valid for `CLOUD-BOOTSTRAP-EXEC-01` only, once. It authorizes the first cloud bootstrap wave, not the whole future implementation. Scope cannot be expanded. No reuse. No W1-W7 authority. No governance checkpoint authority. Cloud transport stays `NOT_PROVEN` until evidence from this execution says otherwise.

## 2. Bound artifacts

Normalization: read raw bytes; UTF-8 BOM present → `MISMATCH` (do not strip); replace CRLF with LF only; no other transformation; SHA-256, uppercase hex.

- `docs/architecture-v1.3.md` = `7DA255F4E980E4E1DEE1DC54C384D840BCEFCB4669192028824606A9E82670E1`
- `state/bootstrap-continuity.json` = `36B7B3F2DB0177717ECF9C4E9BDE5C2E016DDD2B01A266413B3E5F9BBC2935C7`
- `docs/18-cloud-continuation-handoff.md` = `08682E91799D0C23E02041FC7016F133F9908DF3711A81C9491874E12EA49D7C`

This decision does not record its own hash. Hashes are checked against the state as it was before execution. Once execution updates the state, its hash is expected to differ, and that difference is not a mismatch for the running execution.

## 3. Validity check (before any action)

`AUTHORITY_BLOCK` / `STOP`, executing nothing, if any of these is true:

- this decision is missing;
- any bound hash mismatches, or a BOM is present;
- state `authority.status` is not `ACTIVE_NOT_CONSUMED`, or the authority is already consumed;
- execution id is not `CLOUD-BOOTSTRAP-EXEC-01`;
- a requested action is outside section 4;
- superseded commit `b1b7ce29cc253c0f4de764023627e9d819e21ab1` is in history, or bootstrap root `21bd5f8e54b59b4a19d20860802673e70847c049` is not an ancestor of HEAD;
- an unresolved conflict exists between sources.

Do not ask the Owner for permission this decision already grants.

## 4. Allowed (sequential)

1. Read-only GitHub clone/fetch, checkout of `main` in the fresh clone, and repo/state recovery.
2. Read-only check of environment, tool and provider availability.
3. Local controlled synthetic or read-only provider path tests. Provider mapping stays configurable; no provider is mandatory.
4. Schema, runner and contract tests.
5. Update `state/bootstrap-continuity.json` with evidence, consumption, retry/failure state and next action.
6. Prepare one specific next authority/wave, recorded as a proposal in the state. Do not execute it.

Each step yields a machine-readable result adjudicated as `CONTINUE / RETRY / OWNER_REQUIRED / STOP`.

## 5. Write path and budget

- The only versioned governed-worktree write path is `state/bootstrap-continuity.json` (one file).
- Temporary dependencies and evidence may exist locally and briefly outside the product tree. They must not become runtime dependencies or versioned artifacts.
- Budget: max 5 material units and max 5 changed files; whichever limit is reached first applies. The single-file write path above takes precedence over the file ceiling.
- Initial execution is sequential. No parallel workers.

## 6. Disallowed

- Remote writes, push, issues, PRs, releases and tags. Branch creation, deletion or renaming.
- History rewrite.
- Product, code or doc changes, except the state JSON.
- Secrets, and MU/private/project content.
- New major frameworks.
- W1-W7 in bulk, or broad roadmap execution.
- Parallel workers, budget bypass, authority expansion and destructive actions.
- Any external side effect other than read-only fetch and provider invocations for harmless synthetic tasks.

This decision does not authorize publishing this decision, the handoff or the state. Publishing needs separate authorization.

## 7. Retry and failure

- `MAX_SAME_FAILURE_RETRIES=2`. Every retry needs a materially different plan.
- A second occurrence of the same failure → `STOP_RETRY_LOOP`, plus a namespaced `FAILURE_LEARNING_PACKET` saved in the state under `CLOUD-BOOTSTRAP-EXEC-01`.
- Routine test, fix or evidence work is not `OWNER_REQUIRED`. Implementation fixes outside this setup need a fresh wave authority.

## 8. OWNER_REQUIRED

Only for a genuine product or authority decision, an irreversible effect, a security or privacy issue, or a permission expansion. `manual_relay_required_by_user_or_authority_holder=false`.

## 9. Providers

`ROLE != PROVIDER`. The cloud adapter may differ from `LOCAL_BRIDGE`, and `LOCAL_BRIDGE != CLOUD_TRANSPORT`. `METHOD_IS_PORTABLE`. Codex, Claude or two providers are not required. One or many configured providers are acceptable.

## 10. Consumption

Only `CLOUD-BOOTSTRAP-EXEC-01` consumes this authority, whatever the outcome (PASS, STOP or failure). When the run ends, the state must record: `authority.status=CONSUMED`; the execution status and result; evidence; retry/failure state; and `next_action`. After consumption, any new run → `AUTHORITY_BLOCK` / `STOP` until a fresh authority is issued.

## 11. Next wave

The next authority/wave (roadmap order 1: Legacy Reconciliation, or a narrower specific wave) may only be proposed in the state `next_action`. It needs its own gate and its own Owner-issued authority before execution.
