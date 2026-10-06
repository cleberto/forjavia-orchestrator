# Integrações

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Resumo: [Arquitetura](03-arquitetura.md). Este documento é uma projeção e não substitui a norma.

## Princípio

O Forjavia é o **único Control Plane** e é **provider-agnostic**. Providers e executores se integram por adapters versionados e nunca governam o sistema. A authority, que inclui fechar trabalho, aprovar gates e autorizar efeitos, fica no Control Plane.

## Roles e providers

**ROLE != PROVIDER.** Um role é uma função no fluxo, como orchestrator, executor, reviewer ou verifier. Um provider é quem executa essa função.

- Um mesmo provider pode ocupar vários roles. Uma configuração simples usa um único provider, e uma configuração avançada distribui os roles entre vários.
- Os roles são configuráveis e substituíveis sem alterar governança ou estado. Nenhum provider específico é obrigatório, inclusive Codex e Claude.
- O Forjavia não é inerentemente multi-agent. Paralelismo é propriedade do trabalho (dependências, isolamento de escrita e budgets), não do número de agentes disponíveis.
- Mesmo com um único provider, author != verifier continua valendo: a verificação precisa ser independente da autoria.

## Responsabilidades previstas

| Componente | Plano | Responsabilidade prevista |
|---|---|---|
| Forjavia | Control Plane | authority, routing, state, risk, context compilation, permission/effect control, continuation, coordenação de providers, evidence/provenance e UI |
| Spec Kit | Provider Plane | SDD e ciclo de vida da spec: specify/clarify, plano, tarefas, sequenciamento, analyze/implement e convergência |
| TLC Spec-Driven | Provider Plane | dimensionamento adaptativo, fechamento de requisito, traceability, verificação independente, quality gates e lições |
| Understand Anything | Provider Plane | graph de código e dependências, análise de impacto, sinais de ordenação e base visual/tecnológica da Forjavia UI |
| Agentes, scripts, testes, CI | Execution Plane | executores e Sensors substituíveis |

Providers não governam o sistema inteiro. A integração completa está **PLANNED** e nenhum adapter ou contrato desta tabela está pronto.

## Orquestração local e cloud

O método de orquestração é o mesmo em qualquer ambiente: `Orchestrator → governed runner → Executor → structured result/evidence → Orchestrator`. Só o transporte muda (local ou cloud). A autonomia opera sempre dentro da authority concedida e pode seguir automaticamente para tasks dependentes. A intervenção humana ocorre apenas em `OWNER_REQUIRED`, `STOP` material ou decisão de autoridade. A pessoa usuária não precisa transportar manualmente prompts nem resultados entre agentes.

## Regras de integração

- **Adapters versionados:** cada adapter declara um contrato de entrada/saída e uma versão. Se o contrato ou a versão mudar, os pareceres que dependem dele perdem validade.
- **Permission-by-effect:** a permissão é dada pelo efeito (ler, escrever em um caminho, executar um comando, acessar a rede, fazer push), não pelo nome da ferramenta. Efeitos fora do escopo concedido são bloqueados.
- **Authority retida no Control Plane:** providers e executores produzem resultados e evidências. A adjudicação (`CONTINUE / RETRY / OWNER_REQUIRED / STOP`) e o fechamento cabem ao Forjavia. implementation != proof; proof != authority to close; author != verifier.
- **Resultados e evidências:** as saídas são machine-readable, ligadas à revisão e têm provenance.
- **Inferência semântica é advisory:** só fatos estruturais verificáveis podem ser evidence candidate.
- **Sem duplicação:** saídas de providers são inputs, não estado canônico. O Structured State do repositório continua sendo a única source of truth, e não haverá segunda UI operacional.
- **Contexto compilado:** cada role recebe do Context Compiler um contexto proporcional ao risco, nunca providers inteiros nem o histórico completo.

## Estado atual

- **Bridge local experimental:** o relay governado foi comprovado apenas localmente, como perfil de build experimental (Codex→Claude). Ele não define os roles nem exige esses providers. Ver [Governed Bridge](13-governed-bridge.md).
- **Providers:** nenhum está integrado hoje. A integração com Spec Kit, TLC Spec-Driven e Understand Anything está planejada no roadmap e ainda não foi comprovada.
- **Transporte cloud:** em aberto, não comprovado. Os contratos de adapter e o formato do Structured State também estão por definir.

## MCP e GitHub App

MCP e GitHub App são **possíveis adapters** de transporte ou de efeitos e seguem as mesmas regras de versão, permission-by-effect e authority. Não são centro obrigatório da arquitetura, e o Forjavia não depende deles para operar.

## Como propor um provider ou adapter

Abra uma proposta seguindo o [guia de contribuição](../CONTRIBUTING.md), com:

1. **Scope:** capacidade oferecida, plano e roles que pode ocupar, o que fica fora do escopo e sobreposição com providers existentes (sem duplicar responsabilidades).
2. **Permissions:** lista mínima de efeitos necessários e quais deles exigem decisão de autoridade (`OWNER_REQUIRED`).
3. **Output/evidence:** formato machine-readable, versão do contrato, evidência produzida e separação entre resultado advisory e fato estrutural verificável.
4. **Tests:** testes de contrato, testes que comprovem o bloqueio de efeitos não autorizados e fixtures reproduzíveis, sem credenciais reais quando possível.
5. **Provenance/licensing:** origem, versão fixada, licença compatível com o MIT do projeto e créditos em `THIRD_PARTY_NOTICES.md`.

A adoção segue o non-negotiable *integration convergence precedes new major technology adoption*: novas integrações entram depois que as existentes convergirem.
