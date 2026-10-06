# Forjavia

**Control Plane aberto para engenharia de software assistida por agentes.**

O Forjavia é um framework/harness genérico e público que governa como agentes de IA especificam, implementam, verificam e entregam software. Ele não substitui seus agentes nem suas ferramentas de especificação. O Forjavia mantém o estado, a autoridade, o risco e as evidências que conectam essas peças.

> **Estado atual:** fase inicial de baseline. A maior parte deste documento descreve a **arquitetura documentada e normativa** (v1.3), não funcionalidade implementada. A seção [Estado do projeto](#estado-do-projeto) separa o que existe hoje do que é experimental ou planejado.

## O problema

Agentes de IA escrevem código rápido, mas a engenharia em volta deles costuma ser frágil:

- a implementação é tratada como prova de que algo funciona;
- quem escreveu o código também declara que ele está correto;
- o contexto se acumula em prompts e arquivos como `CLAUDE.md` até virar ruído;
- o estado do trabalho fica espalhado entre issue trackers, boards, documentos e conversas;
- a pessoa responsável vira "transporte" manual de prompts e resultados entre agentes.

O Forjavia trata esses pontos como problemas de **governança e estado**, não de escolha de modelo.

## Princípios

- `implementation != proof`
- `proof != authority to close`
- `author != verifier`
- procedimento → script; julgamento → LLM; regra bloqueante → enforcement
- inferência semântica de grafo é *advisory*
- o risco pesa mais que o tamanho do diff
- sem duplicação de source of truth; sem segunda UI operacional
- nenhuma dependência permanente de tracker legado
- o contexto é compilado, não acumulado
- memória de falha é promovida, não despejada
- paralelismo é guiado por dependências
- a integração converge antes da adoção de nova tecnologia de grande porte
- o Owner não é camada de transporte entre agentes

## Fluxo de alto nível

```
Owner → Forjavia Front Door/UI → Structured State → Risk Router
      → Spec Kit / TLC / Understand Anything
      → Executor / Sensors / Verifier
      → Evidence / Converge → State Builder → Forjavia UI / Docs
```

A experiência pretendida é uma só: **"Forjavia, faça X."** Por baixo, providers especializados executam o trabalho sob a governança do Forjavia.

## Três planos

| Plano | Quem | Responsabilidade |
|---|---|---|
| **Control Plane** | Forjavia | estado, governança, autoridade, permissões, roteamento por risco, Context Compiler, reconciliação de legado, agendamento paralelo, evidência/proveniência e integração |
| **Provider Plane** | Spec Kit, TLC, Understand Anything | capacidades especializadas; **providers não governam o sistema** |
| **Execution Plane** | Claude Code, Codex, outros agentes, scripts, testes, CI | execução e sensores, todos **substituíveis** |

### Providers

- **Spec Kit:** motor de Spec-Driven Development (specify, clarify, plan, tasks, analyze, implement, converge), com presets, extensões e workflows.
- **TLC Spec-Driven:** mecânicas de qualidade e verificação: dimensionamento adaptativo, fechamento de requisitos, rastreabilidade, trabalho atômico, verificador independente, sensor de discriminação e lições.
- **Understand Anything:** inteligência de código: grafo Tree-sitter, mapa semântico, busca, impacto de diff e visões arquiteturais e de domínio. É também a base visual da Forjavia UI.

### Executores substituíveis

Claude Code e Codex são executores, não o produto. O Forjavia entrega a cada papel o contexto mínimo suficiente e recebe de volta resultados estruturados e evidências. Qualquer agente que respeite esse contrato pode ser trocado.

### Context Compiler

O Context Compiler é uma **fronteira conceitual permanente** do Control Plane: todo executor e revisor recebe contexto compilado, nunca acumulado. A profundidade é proporcional ao risco (LIGHT / STANDARD / CRITICAL). `CLAUDE.md`, `AGENTS.md`, prompts e payloads de SDK são projeções compiladas, nunca source of truth. A implementação completa está planejada.

## Structured State como source of truth

O estado canônico de um projeto é o **Structured State versionado no repositório**. Todo o resto é projeção:

- `CLAUDE.md`, `AGENTS.md`, prompts e payloads de SDK são **projeções compiladas** do estado;
- a UI é **projeção** do estado e é reconstruível a partir do repositório;
- fontes legadas (issue trackers, boards, documentos, planilhas) servem apenas como entrada durante o *bootstrap* de um projeto existente. Depois da reconciliação, não permanecem como authority, espelho nem segunda área de trabalho.

## Integrated Engineering Graph

```
Requirement ↔ Task ↔ Code ↔ Dependency ↔ Test ↔ Evidence ↔ Commit
```

Na arquitetura, o Work Graph do Forjavia e o Code Graph do Understand Anything se ligam por adapters versionados. A inferência semântica é apenas orientação. Só fatos estruturais verificáveis podem virar candidatos a evidência.

## Forjavia UI

Na arquitetura, a **Forjavia UI** é a **única interface humana principal**. Ela parte do dashboard do Understand Anything e evolui para um app único, com identidade própria e módulos operacionais: Overview, Work, Specs & Requirements, Tasks/Waves, Tests & Sensors, Evidence & Provenance, Decisions/Questions, Releases, Tutorials, Architecture e Governance.

Regra: **UI = projeção; Structured State do repositório = verdade.**

> A Forjavia UI ainda não existe; seu estado é **PLANNED**.

## Estado do projeto

| Item | Estado | Observação |
|---|---|---|
| Arquitetura v1.3 | **DOCUMENTED / NORMATIVE** | [docs/architecture-v1.3.md](docs/architecture-v1.3.md) é a norma vigente; não descreve funcionalidade implementada |
| Baseline público independente | **IMPLEMENTED** (inicial) | repositório público com licença MIT, notices e verificações de baseline (veja o Quick start) |
| Bridge/runner governado local (Orchestrator → runner → Executor → resultado estruturado → adjudicação) | **EXPERIMENTAL** (local) | runner local coberto por `tools/bridge/bridge.test.mjs`; **não é produto pronto**; veja [docs/13-governed-bridge.md](docs/13-governed-bridge.md) |
| Transporte do bridge via GitHub/cloud | **EXPERIMENTAL** | **não comprovado**; o gate de cutover continua aberto |
| Context Compiler | **NORMATIVE** (fronteira) / **PLANNED** (implementação completa) | fronteira conceitual permanente; compilação proporcional ao risco ainda não implementada |
| Lesson Distiller, Parallel Scheduler | **PLANNED** | capacidades condicionais definidas na arquitetura |
| Existing Project Bootstrap / Legacy Reconciliation | **PLANNED** | |
| Integração profunda com Spec Kit, TLC e Understand Anything | **PLANNED** | |
| Integrated Engineering Graph | **PLANNED** | |
| Forjavia UI | **PLANNED** | |
| Release pública do produto completo | **PLANNED** | |

Hoje o Forjavia **não é** um produto instalável de ponta a ponta. Este repositório não traz pacote nem instalador.

## Quick start

Este quick start serve para conhecer o projeto e validar o baseline local. Ele não instala um produto.

**Pré-requisitos:** Git, e Node.js com npm em versão que suporte `--experimental-strip-types` (Node.js ≥ 22.6).

1. **Clone o repositório**

   ```bash
   git clone https://github.com/cleberto/forjavia-orchestrator.git
   cd forjavia-orchestrator
   ```

2. **Leia a arquitetura**

   Comece por [docs/architecture-v1.3.md](docs/architecture-v1.3.md). Depois leia o [roadmap](docs/05-roadmap.md), a descrição do [bridge governado](docs/13-governed-bridge.md) e o [CONTRIBUTING.md](CONTRIBUTING.md).

3. **Valide o baseline na raiz**

   ```bash
   node tools/bridge/bridge.test.mjs
   node tools/third-party-inventory.mjs --check
   ```

4. **Valide o baseline em `web/`**

   ```bash
   cd web
   npm ci
   node --experimental-strip-types scripts/method.test.ts
   node scripts/prepare-hosting.test.mjs
   node scripts/prepare-hosting.mjs
   npx tsc --noEmit --incremental false
   npm run lint
   npm run build
   ```

Todos os comandos devem terminar sem erro antes de você propor qualquer mudança.

## Roadmap resumido

Conforme a arquitetura v1.3 (detalhes em [docs/05-roadmap.md](docs/05-roadmap.md)):

0. Cutover
1. Baseline independente
2. Existing Project Bootstrap / Legacy Reconciliation
3. Spec Kit
4. TLC
5. Understand Anything
6. Integrated Engineering Graph
7. Forjavia UI, evoluindo a UI/dashboard do Understand Anything
8. Benchmarks LIGHT / STANDARD / CRITICAL
9. Simplificação e remoção de duplicação
10. Release pública

Princípio que guia a ordem: a integração converge antes da adoção de nova tecnologia de grande porte.

## Contribuindo

Toda contribuição é **voluntária**: quem participa não assume obrigação nem compromisso de continuidade. Issues, discussões e pull requests são bem-vindos pelo GitHub. Antes de contribuir, leia [CONTRIBUTING.md](CONTRIBUTING.md).

O Forjavia é aberto e não tem versão paga nem open-core comercial. Apoio e doações são opcionais.

## Licença e notices

O código original está sob a licença [MIT](LICENSE). Materiais de terceiros mantêm suas próprias licenças e créditos, listados em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
