# Forjavia

**Control Plane aberto e provider-agnostic para engenharia de software assistida por agentes.**

O Forjavia é um framework/harness genérico e público que governa como o trabalho de engenharia é especificado, planejado, executado, verificado e aceito quando agentes de IA participam dele. Ele não substitui agentes, modelos nem ferramentas de especificação. O Forjavia mantém o estado, a autoridade, o risco e as evidências que conectam essas peças, e funciona com um único provider de IA ou com vários.

> **Estado atual:** fase inicial de baseline. Grande parte deste documento descreve a **arquitetura normativa v1.3**, não funcionalidade implementada. Cada capacidade é marcada como **CURRENT**, **EXPERIMENTAL** ou **PLANNED**. Veja [Estado do projeto](#estado-do-projeto).

## O problema

Agentes de IA escrevem código rápido, mas a engenharia em volta deles costuma ser frágil:

- a implementação é tratada como prova de que algo funciona;
- quem escreveu o código também declara que ele está correto;
- o contexto se acumula em prompts e arquivos de instrução até virar ruído;
- o estado do trabalho fica espalhado entre issue trackers, boards, documentos e conversas;
- humanos viram "transporte" manual de prompts e resultados entre agentes;
- o processo fica preso a um agente ou fornecedor específico.

O Forjavia trata esses pontos como problemas de **governança e estado**, não de escolha de modelo.

## Princípios

- `implementation != proof`
- `proof != authority to close`
- `author != verifier`
- `role != provider`
- procedimento → script; julgamento → LLM; regra bloqueante → enforcement
- inferência semântica de grafo é *advisory*
- o risco pesa mais que o tamanho do diff
- sem duplicação de source of truth; sem segunda UI operacional
- nenhuma dependência permanente de tracker legado
- o contexto é compilado, não acumulado
- memória de falha é promovida, não despejada
- paralelismo é guiado por dependências
- a integração converge antes da adoção de nova tecnologia de grande porte
- humanos não são camada de transporte entre agentes

## Papéis não são providers

O Forjavia separa **papel** (role) de **provider**:

- **Papel** é uma função no fluxo de trabalho: orquestrar, especificar, planejar, executar, revisar, verificar.
- **Provider** é o que cumpre esse papel: um modelo ou agente de IA, um script, uma suíte de testes, um CI.

As consequências são estas:

- Os papéis são **configuráveis e substituíveis**. Nenhum agente ou fornecedor específico é exigido.
- O Forjavia **não é inerentemente multi-agent**. Um projeto pode usar um único provider para vários papéis ou distribuir papéis entre providers diferentes.
- `author != verifier` continua valendo com um único provider: a verificação usa contexto/sessão separados e sensores determinísticos, não a autoavaliação de quem implementou.
- Qualquer executor que receba contexto compilado e devolva resultados estruturados e evidências pode ser trocado.

## Fluxo de alto nível

```
Pedido → Forjavia Front Door/UI → Structured State → Risk Router
       → Spec Kit / TLC / Understand Anything
       → Executor / Sensors / Verifier
       → Evidence / Converge → State Builder → Forjavia UI / Docs
```

A experiência pretendida é uma só: **"Forjavia, faça X."** Por baixo, providers especializados executam o trabalho sob a governança do Forjavia.

### Ciclo contínuo de feature (PLANNED)

Requisito de produto: um pedido de feature deve seguir automaticamente, sem que um humano carregue resultados de uma etapa para a outra, por:

1. compilação de contexto;
2. avaliação de risco;
3. especificação, quando o risco ou a ambiguidade exigir;
4. planejamento;
5. dependências e ordem de execução;
6. execução;
7. testes;
8. reparos;
9. revalidação e verificação independente;

até a **aceitação** ou um **blocker genuíno**. Tudo acontece **dentro da autoridade concedida**: decisões fora dela são escaladas para decisão humana, nunca assumidas pelo agente. Esse ciclo integrado e autônomo **ainda não está comprovado** e permanece **PLANNED**.

## Três planos

| Plano | O que é | Responsabilidade |
|---|---|---|
| **Control Plane** | Forjavia | estado, governança, autoridade, permissões, roteamento por risco, Context Compiler, reconciliação de legado, agendamento paralelo, evidência/proveniência e integração |
| **Provider Plane** | Spec Kit, TLC, Understand Anything | capacidades especializadas; **providers não governam o sistema** |
| **Execution Plane** | agentes de IA de qualquer provider, scripts, testes, CI e outros sensores | execução e sensores, todos **substituíveis** |

## Integrações

### Providers de capacidade (integração profunda: PLANNED)

- **Spec Kit:** motor de Spec-Driven Development (specify, clarify, plan, tasks, analyze, implement, converge), com presets, extensões e workflows.
- **TLC Spec-Driven:** mecânicas de qualidade e verificação: dimensionamento adaptativo, fechamento de requisitos, rastreabilidade, trabalho atômico, verificador independente, sensor de discriminação e lições.
- **Understand Anything:** inteligência de código: grafo Tree-sitter, mapa semântico, busca, impacto de diff e visões arquiteturais e de domínio. É também a base visual da Forjavia UI.

### Providers de execução

Qualquer agente ou modelo de IA, além de scripts, testes e CI, pode cumprir papéis de execução e sensoriamento, desde que respeite o contrato de contexto compilado na entrada e resultado estruturado com evidência na saída.

### Context Compiler

O Context Compiler é uma **fronteira permanente** do Control Plane: todo executor e revisor recebe contexto compilado, nunca acumulado. A profundidade é proporcional ao risco (LIGHT / STANDARD / CRITICAL). Arquivos como `CLAUDE.md` e `AGENTS.md`, prompts e payloads de SDK são projeções compiladas, nunca source of truth. A implementação completa está **PLANNED**.

## Structured State como source of truth

O estado canônico de um projeto é o **Structured State versionado no repositório**. Todo o resto é projeção:

- arquivos de instrução de agentes, prompts e payloads de SDK são **projeções compiladas** do estado;
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
| Arquitetura v1.3 | **CURRENT** (documentação normativa) | [docs/architecture-v1.3.md](docs/architecture-v1.3.md) é a norma vigente; não descreve funcionalidade implementada |
| Baseline público independente | **CURRENT** (inicial) | repositório público com licença MIT, notices de terceiros e verificações de baseline (veja [CONTRIBUTING.md](CONTRIBUTING.md)) |
| Bridge/runner governado local (Orchestrator → runner → Executor → resultado estruturado → adjudicação) | **EXPERIMENTAL** (somente local) | coberto por `tools/bridge/bridge.test.mjs`; **não é produto pronto**; veja [docs/13-governed-bridge.md](docs/13-governed-bridge.md) |
| Perfil atual do bridge (Codex como orquestrador → Claude como executor) | **EXPERIMENTAL** (perfil do ambiente de build) | configuração local usada para construir o próprio Forjavia; **não é regra normativa** nem requisito; os papéis continuam substituíveis |
| Transporte do bridge via GitHub/cloud | **PLANNED** | **não comprovado**; o gate de cutover continua aberto |
| Ciclo contínuo de feature até aceitação ou blocker | **PLANNED** | operação integrada e autônoma ainda não comprovada |
| Context Compiler | **CURRENT** (fronteira normativa) / **PLANNED** (implementação completa) | compilação proporcional ao risco ainda não implementada |
| Lesson Distiller, Parallel Scheduler | **PLANNED** | capacidades condicionais definidas na arquitetura |
| Existing Project Bootstrap / Legacy Reconciliation | **PLANNED** | |
| Integração profunda com Spec Kit, TLC e Understand Anything | **PLANNED** | |
| Integrated Engineering Graph | **PLANNED** | |
| Forjavia UI | **PLANNED** | |
| Release pública do produto completo | **PLANNED** | |

Hoje o Forjavia **não é** um produto instalável de ponta a ponta. Este repositório não traz pacote nem instalador.

## Início rápido

Este início rápido serve para conhecer o projeto e validar o baseline local. Ele não instala um produto.

1. **Clone o repositório**

   ```bash
   git clone https://github.com/cleberto/forjavia-orchestrator.git
   cd forjavia-orchestrator
   ```

2. **Leia a arquitetura**

   Comece por [docs/architecture-v1.3.md](docs/architecture-v1.3.md), que é a norma do projeto. Este README e os demais documentos públicos são projeções dessa arquitetura: não a substituem nem prevalecem sobre ela. Depois leia o [roadmap](docs/05-roadmap.md) e a descrição do [bridge governado](docs/13-governed-bridge.md).

3. **Valide o baseline**

   Os pré-requisitos e os comandos de verificação do projeto (raiz e `web/`) estão em [CONTRIBUTING.md](CONTRIBUTING.md). Todos devem terminar sem erro antes de você propor qualquer mudança.

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

Princípio que guia a ordem: a integração converge antes da adoção de nova tecnologia de grande porte. O roadmap indica direção, não prazos.

## Contribuindo

Toda contribuição é **voluntária**: quem participa não assume obrigação nem compromisso de continuidade. Issues, discussões e pull requests são bem-vindos pelo GitHub. Antes de contribuir, leia [CONTRIBUTING.md](CONTRIBUTING.md), que reúne os comandos do projeto.

O Forjavia é um projeto aberto. Apoio e doações são opcionais.

## Licença e notices

O código original está sob a licença [MIT](LICENSE). Materiais de terceiros mantêm suas próprias licenças upstream e créditos, preservados e listados em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
