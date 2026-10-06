# Arquitetura

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Este documento é um resumo e não a substitui.

## Três planos

| Plano | Quem | Responsabilidade |
|---|---|---|
| Control Plane | Forjavia | state, governance, authority, permissions, risk routing, Context Compiler, Legacy Reconciliation, Parallel Scheduler, evidence/provenance e integração |
| Provider Plane | Spec Kit, TLC, Understand Anything | capacidades especializadas; providers não governam o sistema |
| Execution Plane | Claude Code, Codex, agentes futuros, scripts, testes, CI e demais executores/Sensors | execução e sensores substituíveis |

A integração com Spec Kit, TLC e Understand Anything está planejada. Nenhum provider está integrado hoje.

## Fluxo

Owner → Forjavia Front Door/UI → Structured State → Risk Router → Spec Kit/TLC/Understand Anything → Executor/Sensors/Verifier → Evidence/Converge → State Builder → Forjavia UI/Docs.

## Structured State e source of truth

- O Structured State versionado no repositório é a única fonte da verdade.
- `CLAUDE.md`, `AGENTS.md`, prompts e payloads de SDK são projeções compiladas, nunca fonte da verdade.
- Fontes legadas (issue trackers, boards, documentos, planilhas) podem ser lidas durante o bootstrap, mas não viram espelho permanente nem segunda área de trabalho.
- Evidência fica ligada à revisão; pareceres perdem validade quando seus inputs mudam.

## Context Compiler

Capability do Control Plane, sempre presente como boundary de contexto, com profundidade proporcional ao risco (LIGHT, STANDARD, CRITICAL). Produz o menor contexto suficiente para cada papel; não carrega providers inteiros, histórico completo ou lessons não relacionadas.

## Integrated Engineering Graph

Requirement ↔ Task ↔ Code ↔ Dependency ↔ Test ↔ Evidence ↔ Commit.

O Work Graph do Forjavia e o Code Graph do Understand Anything serão ligados por adapters versionados. Inferência semântica é advisory; somente fatos estruturais verificáveis podem ser candidatos a evidência.

## Forjavia UI (futura)

A Forjavia UI será a única interface humana principal, construída a partir do dashboard do Understand Anything e evoluída com identidade própria e módulos operacionais (Overview, Work, Specs & Requirements, Tasks/Waves, Tests & Sensors, Evidence & Provenance, Decisions/Questions, Releases, Architecture, Governance). Não haverá segunda UI operacional.

Regra: UI = projeção; Structured State do repositório = verdade. A UI ainda não existe.

## Governed Agent Relay

Fluxo entre agentes: Orchestrator → governed runner → Executor → resultado estruturado/evidência → Orchestrator, com adjudicação `CONTINUE / RETRY / OWNER_REQUIRED / STOP`. Hoje está comprovado apenas localmente.

## Non-negotiables

implementation != proof; proof != authority to close; author != verifier; risk dominates diff size; no source-of-truth duplication; no second operational UI; no permanent legacy tracker dependency; context is compiled, not accumulated; parallelism is dependency-driven; the Owner is not a transport layer between agents.
