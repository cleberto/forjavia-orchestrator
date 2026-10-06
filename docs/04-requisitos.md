# Requisitos e critérios de aceite

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Resumo: [03-arquitetura.md](03-arquitetura.md). Ordem de entrega: [05-roadmap.md](05-roadmap.md). Visão geral: [README](../README.md).

Este documento substitui a versão anterior onde ela divergia da arquitetura v1.3. Hospedagem, contas, tenants e prévia web não são requisitos do produto.

## Estados

- **CURRENT**: existe no repositório e é verificável hoje; pode ser qualificado como experimental ou local.
- **PLANNED**: contrato-alvo definido pela arquitetura, ainda não implementado.

Um requisito não passa a CURRENT por estar descrito aqui. A mudança de estado exige evidência verificada; veja [verificação e evidência](verification-and-evidence.md) e [conceitos e estado](concepts-and-state.md).

## Control Plane e authority

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| CP-001 | O Forjavia é o único Control Plane | PLANNED | Routing, authority e fechamento nunca são decididos por provider ou executor |
| CP-002 | Authority explícita e separada de prova | PLANNED | Fechar, aprovar ou alterar escopo exige decisão registrada de quem tem autoridade; evidência sozinha não fecha |
| CP-003 | Relay governado entre papéis | CURRENT (experimental, local) | Orchestrator → runner → Executor → resultado estruturado → adjudicação, sem o Owner como transporte; hoje só no perfil local Codex→Claude; veja [13-governed-bridge.md](13-governed-bridge.md) |
| CP-004 | Intervenção humana apenas quando necessária | PLANNED | O Owner é acionado só em `OWNER_REQUIRED` real, `AUTHORITY_BLOCK`, bloqueio irrecuperável ou `STOP` material |

## Autonomia governada

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| AUTO-001 | `AUTO_CONTINUE_WHILE_AUTHORIZED` | PLANNED | O fluxo avança entre tarefas sem comando humano a cada passo enquanto houver autoridade registrada; nunca amplia a própria autoridade |
| AUTO-002 | `USER_INTENT_CAN_DRIVE_MULTI_TASK_WORKFLOW` | PLANNED | Um único pedido conduz contexto, risco, spec quando necessária, plano, tasks/dependências/ordenação, execução, teste, reparo, revalidação, verificação e convergência |
| AUTO-003 | Condições de parada explícitas | PLANNED | O ciclo para em entrega, `OWNER_REQUIRED` real, `AUTHORITY_BLOCK` ou bloqueio irrecuperável, com o motivo registrado no Structured State |

## Papéis e providers

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| ROLE-001 | `ROLE != PROVIDER` | PLANNED | Papéis são configuráveis; um provider pode ocupar vários papéis, um provider simples pode operar o fluxo e vários providers podem dividir papéis |
| ROLE-002 | Multi-agent opcional | PLANNED | O Forjavia funciona sem exigir vários agentes, preservando `author != verifier` por configuração de papéis |
| ROLE-003 | Nenhum perfil é universal | PLANNED | O perfil local Codex→Claude é uma configuração entre outras; nenhum contrato depende dele |

## Source of truth

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| SOT-001 | Structured State versionado no repositório como única source of truth | PLANNED | UI, docs gerados, `CLAUDE.md`, `AGENTS.md` e prompts são reconstruíveis a partir dele; o schema ainda não existe |
| SOT-002 | Sem duplicação de verdade | PLANNED | Projeções não são aceitas como fonte; divergência é resolvida a favor do Structured State |
| SOT-003 | Fontes legadas apenas no bootstrap | PLANNED | Nenhuma fonte legada vira authority automaticamente; após a reconciliação, a dependência operacional é encerrada |
| SOT-004 | GitHub como distribuição e histórico | PLANNED | Issues, boards ou outros recursos do GitHub não substituem o Structured State como estado operacional |

## Roteamento por risco

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| RISK-001 | Classificação LIGHT / STANDARD / CRITICAL | PLANNED | Todo Work Item tem nível de risco antes da execução; o risco prevalece sobre o tamanho do diff |
| RISK-002 | Risco desconhecido não é risco baixo | PLANNED | Fatores não informados mantêm o item pendente ou elevam o nível; nunca geram aprovação automática |
| RISK-003 | Contexto proporcional ao risco | PLANNED | O Context Compiler entrega o menor contexto suficiente por papel e risco, sem carregar providers inteiros nem histórico completo |

## Resultado estruturado e evidência

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| EVD-001 | Resultado machine-readable do executor | CURRENT (experimental, local) | Resultado fora do contrato é rejeitado, não interpretado |
| EVD-002 | Evidência vinculada a caminho, hash e revisão | PLANNED | Mudança em qualquer input invalida a evidência dependente |
| EVD-003 | Findings com fonte e confiança | PLANNED | Cada finding indica fonte, impacto e confiança, distinguindo fato de hipótese |

## Verificação independente

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| VER-001 | `author != verifier` | PLANNED | Quem implementou não verifica o próprio trabalho |
| VER-002 | Sensors exigidos por risco | PLANNED | Testes e sensores obrigatórios são declarados antes da execução e executados de fato |
| VER-003 | Adjudicação sem PASS automático | CURRENT (experimental, local) para a adjudicação; PLANNED para o restante | Toda saída recebe `CONTINUE`, `RETRY`, `OWNER_REQUIRED` ou `STOP`; ausência de falha não é PASS |

## Princípios operacionais

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| PRIN-001 | procedimento → script; julgamento → LLM; regra bloqueante → enforcement | PLANNED | Regras bloqueantes automatizáveis são aplicadas por validação determinística, não por instrução em prompt |
| PRIN-002 | Falha destilada, não despejada | PLANNED | Lessons só nascem de falha ou finding relevante, mantêm provenance da evidência de origem e migram para Sensor/enforcement quando automatizáveis; PASS limpo não cria lesson |
| PRIN-003 | Paralelismo comprovado | PLANNED | Só há paralelização com dependências, isolamento de escrita e budget explícitos; escrita concorrente não isolada na mesma árvore é bloqueada |
| PRIN-004 | Convergência antes de adoção | PLANNED | Nova tecnologia relevante só entra depois que a integração existente convergiu |

## Fronteiras de providers e executores

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| PRV-001 | Providers de capacidade via adapters versionados | PLANNED | Spec Kit (ciclo SDD), TLC Spec-Driven (qualidade e verificação) e Understand Anything (Code Intelligence) entram por adapters; nenhum está integrado hoje |
| PRV-002 | Inferência semântica é advisory | PLANNED | Só fatos estruturais verificáveis viram candidatos a evidência |
| PRV-003 | Providers de execução substituíveis | PLANNED | Claude, Codex ou qualquer executor que cumpra o contrato de resultado pode ser trocado sem alterar o estado |
| PRV-004 | Evolução controlada de métodos | PLANNED | Versões fixadas por projeto, origem verificável e atualização com diff, sem sobrescrever ajustes locais |
| PRV-005 | Providers não governam | PLANNED | Nenhum provider decide routing, authority ou fechamento, inclusive durante a reconciliação de projetos existentes |

## Baseline e transporte

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| BASE-001 | Baseline público independente | CURRENT (inicial) | As verificações do Quick start do [README](../README.md) terminam sem erro |
| BASE-002 | Transporte do relay via GitHub/cloud | PLANNED | Não comprovado; o gate de cutover permanece aberto |

## Futuro: grafo e UI

| ID | Requisito | Estado | Critério de aceite |
|---|---|---|---|
| GRAPH-001 | Integrated Engineering Graph | PLANNED | Requirement ↔ Task ↔ Code ↔ Dependency ↔ Test ↔ Evidence ↔ Commit navegável a partir do Structured State |
| UI-001 | Forjavia UI como única interface humana principal | PLANNED | A UI é projeção reconstruível do repositório, evoluída a partir do dashboard do Understand Anything; não existe segunda UI operacional |

## Notas

- O conteúdo de `web/` é verificado como parte do baseline (BASE-001), mas não define requisitos do produto.
- Não marcar critérios PLANNED como implementados por existirem neste documento.
