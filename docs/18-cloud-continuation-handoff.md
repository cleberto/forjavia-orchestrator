# 18 — Cloud Continuation Handoff

Status: handoff de continuidade para o gate `CLOUD_BOOTSTRAP_AND_CONTINUATION_SETUP`.
Este documento NÃO declara cloud PASS. Cloud transport permanece `NOT_PROVEN`.
A versão cloud só é distribuída após push separado e autorizado.

## 0. Precedência

`architecture > active authority > versioned state > handoff`

1. Arquitetura: `docs/architecture-v1.3.md`
2. Authority ativa: `decisions/OD-FORJAVIA-CLOUD-BOOTSTRAP-01.md` (SINGLE_USE, publicada no mesmo push deste handoff; status `ACTIVE_NOT_CONSUMED`)
3. Versioned state: `state/bootstrap-continuity.json`
4. Este handoff (guia procedural, menor precedência)

Conflito não resolvido entre fontes → `STOP`.

## 1. Clone limpo

```
git clone https://github.com/cleberto/forjavia-orchestrator
cd forjavia-orchestrator
git checkout main
git status --porcelain
```

- `git status --porcelain` deve retornar vazio.
- Bootstrap root deve ser ancestral de HEAD:

```
git merge-base --is-ancestor 21bd5f8e54b59b4a19d20860802673e70847c049 HEAD && echo ROOT_OK
```

- O commit superseded `b1b7ce29cc253c0f4de764023627e9d819e21ab1` (publish=false) NÃO pode fazer parte da história pública. Se o comando abaixo imprimir `STOP_SUPERSEDED_IN_HISTORY`, pare:

```
git merge-base --is-ancestor b1b7ce29cc253c0f4de764023627e9d819e21ab1 HEAD && echo STOP_SUPERSEDED_IN_HISTORY
```

## 2. Ordem de leitura

1. `state/bootstrap-continuity.json`: objetivo, status, gate, budget, retry/failure, next action.
2. `decisions/OD-FORJAVIA-CLOUD-BOOTSTRAP-01.md`: escopo exato autorizado e hashes finais vinculados.
3. `docs/architecture-v1.3.md`: invariantes que prevalecem sobre tudo.

Nenhum chat, sessão anterior ou memória externa é necessário nem aceito como fonte.

## 3. Validação de hashes (normalização exata)

Regra: ler bytes do arquivo; se houver BOM UTF-8 → `MISMATCH` (não remover); substituir somente CRLF por LF; nenhuma outra transformação (sem trim, sem ajuste de newline final); SHA-256 em hex maiúsculo.

```
python3 -I -c "import hashlib,sys;b=open(sys.argv[1],'rb').read();print('BOM_MISMATCH' if b[:3]==bytes([239,187,191]) else hashlib.sha256(b.replace(bytes([13,10]),bytes([10]))).hexdigest().upper())" docs/architecture-v1.3.md
```

- Esperado para `docs/architecture-v1.3.md`: `7DA255F4E980E4E1DEE1DC54C384D840BCEFCB4669192028824606A9E82670E1`.
- Para `state/bootstrap-continuity.json` e este handoff: calcular com o mesmo comando e comparar com os hashes vinculados na decision `decisions/OD-FORJAVIA-CLOUD-BOOTSTRAP-01.md`.
- Este handoff e o state nunca contêm hash da authority, do handoff ou de si mesmos. A decision, publicada no mesmo push, é quem vincula os hashes finais de ambos.
- Qualquer divergência → `STOP`.

## 4. Verificação de status (deve coincidir com o state)

- M0A_PASS, M0B_PASS, M0C_PASS.
- M0D: `M0D-STABILIZATION-EXEC-01` permanece `M0D_BLOCK`; supplemental `M0D-RECOVERY-NARROW-FIX-EXEC-01` PASS resolve o único blocker; composite atual `M0D_PASS`.
- `BOOTSTRAP_RUNNER_STABILIZATION_COMPLETE=TRUE`.
- Local bridge L1-L5 e uma real governed wave: provados localmente. `LOCAL_BRIDGE != CLOUD_TRANSPORT`; cloud transport `NOT_PROVEN`.
- PUBLIC_DOCUMENTATION_RECONCILIATION: concluída no candidato local.
- W1-W7: NÃO autorizadas.
- `SUPERSEDED_UNPUSHED_CLOUD_HANDOFF=true` (commit `b1b7ce29cc253c0f4de764023627e9d819e21ab1`, publish=false).
- Gate `CLOUD_BOOTSTRAP_AND_CONTINUATION_SETUP`: `AUTHORIZED_NOT_STARTED`. Authority: `ACTIVE_NOT_CONSUMED`.

## 5. Primeira ação (somente dentro da authority)

1. Authority ausente, hash divergente, já consumida (SINGLE_USE) ou escopo divergente → `AUTHORITY_BLOCK` / `STOP`. Não executar nada. Não solicitar ao Owner permissão já concedida nesta decision versionada.
2. Conflito não resolvido entre fontes → `STOP`.
3. Authority presente e válida → executar `CLOUD-BOOTSTRAP-EXEC-01`, sequencialmente:
   1. Recuperar repo/state (passos 1-4).
   2. Validar ambiente, tools e providers configurados.
   3. Executar testes sintéticos controlados.
   4. Validar schema e runner.
   5. Atualizar continuidade local (evidence, consumo SINGLE_USE, retry/failure).
   6. Preparar a próxima authority/wave específica, sem executá-la.

Cada passo produz resultado machine-readable adjudicado como `CONTINUE / RETRY / OWNER_REQUIRED / STOP`.

## 6. Fora do escopo

Remote writes/push, release, branch ops, rewrite de história, secrets, conteúdo private/project/MU, framework major, W1-W7 em bloco, implementação ampla, budget bypass e escalada de autoridade.

## 7. Budget, retry e falha

- Budget: 5 units + 5 files; o primeiro limite atingido vence. Execução sequencial.
- Mesma falha: no máximo 2 tentativas; retry exige plano alterado.
- Segunda ocorrência da mesma falha → `STOP` + scoped failure packet persistido no state.

## 8. Providers e roles

- `ROLE != PROVIDER`. Providers são configuráveis (um ou vários); nenhum provider específico (Codex, Claude ou outro) é obrigatório.
- Método portável. Multi-task autonomy: `PLANNED`, sempre dentro da authority.
- Context Compiler: permanente, profundidade proporcional ao risco. Lesson Distiller: condicional. Parallel Scheduler: condicional a dependencies, isolation e budget.

## 9. Owner

`manual_relay_required_by_user_or_authority_holder=false`: o usuário/detentor de authority não retransmite prompts nem resultados. `OWNER_REQUIRED` é escalada de governança genuína, apenas para decisão genuína, risco irreversível, segurança, privacidade ou permissão ainda não concedida.

## 10. Após o gate cloud

Legacy Reconciliation → Spec Kit → TLC → Understand Anything → Integrated Engineering Graph → UI → benchmarks → simplify → release. Cada item exige gate e authority próprios.

## 11. Higiene

Sem paths locais, dados de usuário/máquina, chats/sessions ou secrets em qualquer artefato versionado.
