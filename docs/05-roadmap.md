# Roadmap

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). O roadmap é guiado por gates verificáveis, sem datas.

## Fases (arquitetura v1.3)

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

Princípio de ordem: a convergência da integração precede a adoção de nova tecnologia de grande porte.

## Gate de cutover

O cutover local→GitHub/cloud exige provar: resultado machine-readable, adjudicação pelo Orchestrator, `CONTINUE / RETRY / OWNER_REQUIRED / STOP`, bloqueio de execução não autorizada, persistência de estado entre contextos e uma wave real governada end-to-end. O bridge está comprovado localmente; o transporte GitHub/cloud ainda não.

## Capacidades transversais

- **Context Compiler (permanente):** sempre presente como boundary de contexto, com profundidade proporcional ao risco. LIGHT: contexto mínimo, alvo direto, blocking rules e sensor exigido. STANDARD: spec/plan escopado, vizinhança do grafo, rules/lessons relevantes e verificação independente. CRITICAL: recon, domínio, arquitetura, blast radius, autoridade/permissões e sensores/revisão mais fortes.
- **Lesson Distiller (condicional):** só entra após falha ou finding relevante, retrabalho material, blocker recorrente ou escaped defect. PASS limpo não cria lesson. Fluxo: falha/evidência → causa raiz → lesson fundamentada → regra candidata → Sensor/validator/teste/enforcement quando automatizável.
- **Parallel Scheduler (condicional):** subordinado ao Orchestrator; só paraleliza quando o grafo de dependência/conflito, o isolamento de escrita e os budgets permitem. Escrita concorrente não isolada na mesma árvore é proibida por padrão.

Nenhuma dessas capacidades está implementada hoje, e nenhuma pode criar segunda fonte da verdade ou orquestrador concorrente.

## Métricas

Além de evidência por tarefa e retrabalho: context compile hit-rate / retrieved bytes, lesson promotions / sensor promotions e parallel efficiency / merge-repair cost. O objetivo é comprovar redução de releitura e retrabalho sem custo fixo de tokens. Nenhum ganho é anunciado sem baseline e medição.
