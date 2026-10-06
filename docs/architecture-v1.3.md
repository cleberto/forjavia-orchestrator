# Forjavia — Arquitetura Final Integrada v1.3

**Stack:** Spec Kit + TLC Spec-Driven + Forjavia + Understand Anything

**Decisão central:** Forjavia é o único Control Plane. Spec Kit é o motor SDD; TLC fornece mecânicas de qualidade/verificação; Understand Anything fornece Code Intelligence e a base visual/estrutural da UI.

## Escopo
- GitHub público.
- Sem Forjavia Cloud.
- Sem Engine pago/open-core comercial.
- Doações/apoio opcionais.
- Structured State = source of truth.
- **Forjavia UI = única interface humana principal.**
- **Fontes legadas não permanecem na arquitetura operacional final:** issue trackers, boards, documentos, roadmaps e outros sistemas externos podem ser lidos/importados temporariamente durante o bootstrap de um projeto existente, mas não se tornam source of truth, espelho permanente ou segunda área de trabalho. Após reconciliação, o Structured State do Forjavia assume a operação.
- A Forjavia UI será construída a partir da base do dashboard do Understand Anything, reaproveitando e evoluindo graph, search, navigation e node inspection com identidade própria e módulos operacionais do Forjavia.

## Fluxo
Owner → Forjavia Front Door/UI → Structured State → Risk Router → Spec Kit/TLC/Understand Anything → Executor/Sensors/Verifier → Evidence/Converge → State Builder → Forjavia UI/Docs.

## Ownership
- **Forjavia:** governance, authority, permissions, provenance, invalidation, state, risk, routing, context, UX e integração.
- **Spec Kit:** specify/clarify/plan/tasks/analyze/implement/converge + presets/extensions/workflows.
- **TLC:** adaptive sizing, requirement closure, traceability, atomic work, independent verifier, discrimination sensor, lessons.
- **Understand Anything:** Tree-sitter graph, semantic map, search, diff impact, architectural/domain views e base do dashboard/UI.

## Forjavia UI
A interface final não é um dashboard paralelo ao Understand Anything. O dashboard do Understand Anything será a **base tecnológica/visual inicial** e será evoluído para um único App:

- Overview
- Work: Inbox / Active / Blocked / Delivered
- Specs & Requirements
- Tasks / Waves
- Tests & Sensors
- Evidence & Provenance
- Decisions / Questions
- Releases
- Tutorials: Test Guide / Player / GM/Admin / Video Script
- Architecture: Structural Graph / Domain Graph / Diff Impact / Guided Tours
- Governance: Gates / Authority / Permissions / Quality Floor

**Regra:** UI = projection; Repo Structured State = truth.

## Integrated Engineering Graph
Requirement ↔ Task ↔ Code ↔ Dependency ↔ Test ↔ Evidence ↔ Commit.

O Work Graph do Forjavia e o Code Graph do Understand Anything são ligados por adapters/versioned integration. A inferência semântica do UA é advisory; somente fatos estruturais verificáveis podem ser usados como evidence candidate.

## Non-negotiables
- implementation != proof
- proof != authority to close
- author != verifier
- procedure → script; judgment → LLM; blocking rule → enforcement
- semantic graph inference is advisory
- risk dominates diff size
- no source-of-truth duplication
- no second operational UI
- no permanent legacy tracker dependency
- context is compiled, not accumulated
- failure memory is promoted, not dumped
- parallelism is dependency-driven
- integration convergence precedes new major technology adoption
- the Owner is not a transport layer between agents


## Capacidades condicionais e de bootstrap consolidadas na V1.3

### Context Compiler
Capability do **Forjavia Control Plane**. Está sempre presente como boundary de contexto, mas sua profundidade é **sob demanda e proporcional ao risco**. Recebe Work Item, role, risk, requirements, neighborhood do Code Graph, rules/lessons relevantes, permission-by-effect e required Sensors; produz o menor contexto suficiente para o executor/reviewer. `CLAUDE.md`, `AGENTS.md`, prompts e payloads de SDK são **projeções compiladas**, nunca source of truth.

- LIGHT: contexto mínimo + alvo direto + blocking rules + required sensor.
- STANDARD: spec/plan escopado + graph neighborhood + rules/lessons relevantes + independent verify.
- CRITICAL: recon/domain/architecture + blast radius + authority/permissions + stronger sensors/review.
- Regra: não carregar providers inteiros, histórico completo ou lessons não relacionadas “por segurança”.

### Lesson Distiller / Learning Promotion Pipeline
Capability **condicional**: só entra após falha/finding relevante, retrabalho material, blocker recorrente ou escaped defect. PASS limpo não cria lesson.

`failure/evidence → root cause → grounded lesson → candidate rule → Sensor/validator/test/enforcement quando automatizável`

Logs brutos de tentativa não devem inflar `CLAUDE.md`. Lessons precisam manter provenance para a evidência de origem. Se a regra depender de julgamento, permanece em Skill/rule/contexto seletivo; se puder ser automatizada, deve migrar para enforcement determinístico.

### Parallel Scheduler
Capability **condicional**, subordinada ao Orchestrator. Só paraleliza quando dependency/conflict graph, isolamento de escrita e budgets permitem.

- Paralelismo é propriedade do trabalho, não do número de agentes disponíveis.
- Sessões humanas: guideline de UX de poucas sessões simultâneas (tipicamente até ~3).
- Workers gerenciados pelo Forjavia: sem limite fixo “3”; concorrência limitada por dependency parallelism, safe write isolation, context/token budget, provider limits e merge/reverification cost.
- Escrita concorrente não isolada na mesma árvore é proibida por padrão.

### Existing Project Bootstrap / Legacy Reconciliation
Capability do **Forjavia Control Plane** acionada quando o Forjavia é aplicado a um projeto existente. Descobre e reconcilia código, documentação, backlog legado, decisões, testes, evidências, work items incompletos e fontes externas temporárias antes de promover qualquer estado a canônico.

- Fontes legadas podem incluir issue trackers, boards, documentos, planilhas, roadmaps ou outros sistemas externos.
- Nenhuma fonte legada é automaticamente authority.
- Estado declarado deve ser confrontado com código, testes, evidências e dependências atuais.
- Work items podem ser mantidos, reescritos, divididos, mesclados, bloqueados, descartados ou replanejados.
- O resultado é convertido para Structured State e usado para reconstruir requirements, dependencies, risks, tasks e roadmap.
- Após a reconciliação, a dependência operacional da fonte legada deve ser encerrada.
- Spec Kit, TLC e Understand Anything podem auxiliar a reconciliação, mas routing e authority permanecem no Forjavia.

### Governed Agent Relay / Bootstrap Gate
O fluxo normal entre agentes deve ser automatizado e estruturado: `Orchestrator → governed runner → Executor → structured result/evidence → Orchestrator`. O Owner não atua como ponte manual de prompts e resultados. Intervenção humana ocorre apenas em `OWNER_REQUIRED`, `STOP` material ou decisão de autoridade.

Para cutover local→GitHub/cloud, o bootstrap deve provar pelo menos: resultado machine-readable, adjudicação pelo Orchestrator, `CONTINUE / RETRY / OWNER_REQUIRED / STOP`, bloqueio de execução não autorizada, persistência de estado entre contextos e uma wave real governada end-to-end.

### Três planos funcionais

- **Control Plane:** Forjavia — state, governance, authority, permissions, risk routing, Context Compiler, Legacy Reconciliation, Parallel Scheduler, evidence/provenance e integração.
- **Provider Plane:** Spec Kit (SDD lifecycle), TLC (quality/verification mechanics), Understand Anything (Code Intelligence). Providers não governam o sistema inteiro.
- **Execution Plane:** Claude Code, Codex, future agents, scripts, tests, CI, Unity e demais executores/Sensors.

## Roadmap
0. Cutover
1. Baseline independente
2. Existing Project Bootstrap / Legacy Reconciliation
3. Spec Kit
4. TLC
5. Understand Anything
6. Integrated Engineering Graph
7. Forjavia UI — evoluir a UI/dashboard do Understand Anything
8. Benchmarks LIGHT/STANDARD/CRITICAL
9. Simplify / delete duplication
10. Public release

## Resultado
Uma única experiência operacional:

**“Forjavia, faça X.”**

Por baixo: Spec Kit + TLC + Understand Anything + governança Forjavia.  
Por cima: **uma única Forjavia UI**, reconstruível a partir do estado canônico do repositório.

## Métricas V1.3

Além das métricas existentes: `context compile hit-rate / retrieved bytes`, `lesson promotions / sensor promotions` e `parallel efficiency / merge-repair cost`. O objetivo é comprovar que as capacidades novas reduzem releitura/retrabalho sem criar custo fixo de tokens.

## Definition of Done adicional da V1.3

- Context Compiler prova contexto proporcional por risco.
- Lesson Distiller só persiste aprendizado fundamentado e promove automação quando viável.
- Parallel Scheduler só paraleliza com independência, isolamento e budgets explícitos.
- Existing Project Bootstrap reconcilia fontes legadas sem promovê-las automaticamente a authority.
- Governed Agent Relay elimina o Owner como transporte normal entre agentes e preserva gates de autoridade.
- Nenhuma dessas capacidades cria segunda source of truth ou novo orquestrador concorrente.
