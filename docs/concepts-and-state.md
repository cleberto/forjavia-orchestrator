# Conceitos e estado

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Resumo: [03-arquitetura.md](03-arquitetura.md). Visão geral: [README](../README.md).

Este documento define conceitos normativos. **Nenhum schema de Structured State está implementado**; formato, localização e campos ainda serão definidos.

## Structured State
É o estado canônico de um projeto, versionado no repositório e única source of truth. Toda mudança de estado é revisável pelo controle de versão. Qualquer outra representação é projeção.

## Work Item
Unidade de trabalho governada pelo Control Plane. Conceitualmente reúne requisitos, nível de risco, efeitos permitidos, Sensors exigidos, dependências, evidências e decisões. Na UI planejada, os Work Items aparecem como Inbox / Active / Blocked / Delivered; essa visão é projeção, não estado próprio.

## Entidades
- **Requirement**: o que deve ser verdade, com critério de aceite verificável.
- **Task**: unidade atômica de execução ligada a um ou mais requirements. O paralelismo segue as dependências.
- **Evidence**: artefato verificável que sustenta uma afirmação, com proveniência e vínculo a caminho, hash e revisão.
- **Decision**: escolha registrada com autoridade, inputs e justificativa. Perguntas abertas permanecem abertas até haver decisão.

As relações entre elas formam o Integrated Engineering Graph (PLANNED): Requirement ↔ Task ↔ Code ↔ Dependency ↔ Test ↔ Evidence ↔ Commit.

## Status: current versus target
Toda afirmação de estado separa **current** (verificado hoje) de **target** (pretendido). Um target só vira current com evidência adjudicada, nunca por declaração. A documentação pública usa os rótulos CURRENT, EXPERIMENTAL, PLANNED e NORMATIVE com esse mesmo sentido.

## Projeções
`CLAUDE.md`, `AGENTS.md`, prompts, payloads de SDK, documentos gerados e a Forjavia UI são projeções compiladas ou renderizadas a partir do Structured State. Elas são reconstruíveis. Uma edição feita só na projeção não vira verdade, e qualquer divergência é resolvida a favor do estado.

## Authority
Authority é o direito de aprovar, fechar ou mudar escopo. É separada de prova: evidência sustenta uma decisão, mas não a toma. Providers, executores e fontes legadas não têm authority. Decisões de autoridade cabem ao Owner ou a quem ele delegar de forma registrada.

## Migração e fontes legadas
Ao aplicar o Forjavia a um projeto existente, issue trackers, boards, documentos, planilhas e roadmaps podem ser lidos durante o bootstrap (PLANNED). O estado declarado nessas fontes é confrontado com código, testes, evidências e dependências. Cada item pode ser mantido, reescrito, dividido, mesclado, bloqueado, descartado ou replanejado antes de virar Structured State. Depois da reconciliação, a dependência operacional da fonte legada é encerrada. O mesmo vale para documentos antigos deste repositório: versões substituídas não são authority onde divergem da norma.

## Invalidação
Quando um input muda (código, requisito, decisão ou arquivo referenciado por hash), as evidências e os pareceres que dependem dele perdem validade e o Work Item volta a exigir verificação. Lições aprendidas mantêm proveniência para a evidência de origem.
