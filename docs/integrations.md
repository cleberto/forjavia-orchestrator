# Integrações

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Resumo: [Arquitetura](03-arquitetura.md). Este documento é uma projeção e não substitui a norma.

## Princípio

O Forjavia é o **único Control Plane**. Providers e executores se integram por adapters versionados e nunca governam o sistema. A authority (fechar trabalho, aprovar gates, autorizar efeitos) fica no Control Plane.

## Papéis

| Componente | Plano | Papel |
|---|---|---|
| Forjavia | Control Plane | state, governance, authority, permissions, risk routing, Context Compiler, evidence/provenance e integração |
| Spec Kit | Provider Plane | motor SDD e workflow: specify/clarify/plan/tasks/analyze/implement/converge, presets/extensions/workflows |
| TLC | Provider Plane | qualidade e verificação: adaptive sizing, requirement closure, traceability, atomic work, independent verifier, discrimination sensor, lessons |
| Understand Anything | Provider Plane | Code Intelligence (Tree-sitter graph, semantic map, search, diff impact, views arquiteturais/de domínio) e base da futura Forjavia UI |
| Claude Code, Codex, agentes futuros, scripts, testes, CI | Execution Plane | executores e Sensors substituíveis |

Nenhum executor é obrigatório. Claude e Codex podem ser trocados sem alterar governança ou estado.

## Regras de integração

- **Adapters versionados:** cada adapter declara um contrato de entrada/saída e uma versão. Se o contrato ou a versão mudar, os pareceres que dependem dele perdem validade.
- **Permission-by-effect:** a permissão é dada pelo efeito (ler, escrever em um caminho, executar um comando, acessar a rede, fazer push), não pelo nome da ferramenta. Efeitos fora do escopo concedido são bloqueados.
- **Authority retida no Control Plane:** providers e executores produzem resultados e evidências. A adjudicação (`CONTINUE / RETRY / OWNER_REQUIRED / STOP`) e o fechamento cabem ao Forjavia. implementation != proof; proof != authority to close; author != verifier.
- **Resultados e evidências:** saídas machine-readable, ligadas à revisão e com provenance.
- **Inferência semântica é advisory:** só fatos estruturais verificáveis podem ser evidence candidate.
- **Sem duplicação:** saídas de providers são inputs, não estado canônico. O Structured State do repositório continua sendo a única source of truth, e não haverá segunda UI operacional.
- **Contexto compilado:** providers e executores recebem do Context Compiler um contexto proporcional ao risco, nunca providers inteiros nem o histórico completo.

## Estado atual

- **Bridge local experimental:** o relay governado foi comprovado apenas localmente. Ver [Governed Bridge](13-governed-bridge.md).
- **Providers:** nenhum está integrado hoje. A integração profunda com Spec Kit, TLC e Understand Anything está planejada no roadmap e ainda não foi comprovada.
- **Transporte via GitHub/cloud:** em aberto, não comprovado. Contratos de adapter e formato do Structured State também estão por definir.

## MCP e GitHub App

MCP e GitHub App são **possíveis adapters** de transporte ou de efeitos e seguem as mesmas regras de versão, permission-by-effect e authority. Não são centro obrigatório da arquitetura, e o Forjavia não depende deles para operar.

## Como propor um provider ou adapter

Abra uma proposta seguindo o [guia de contribuição](../CONTRIBUTING.md), com:

1. **Scope:** capacidade oferecida, plano em que atua, o que fica fora do escopo e sobreposição com providers existentes (sem duplicar responsabilidades).
2. **Permissions:** lista mínima de efeitos necessários e quais deles exigem decisão do Owner.
3. **Output/evidence:** formato machine-readable, versão do contrato, evidência produzida e separação entre resultado advisory e fato estrutural verificável.
4. **Tests:** testes de contrato, testes que comprovem o bloqueio de efeitos não autorizados e fixtures reproduzíveis, sem credenciais reais quando possível.
5. **Provenance/licensing:** origem, versão fixada, licença compatível com o MIT do projeto e créditos em `THIRD_PARTY_NOTICES.md`.

A adoção segue o non-negotiable *integration convergence precedes new major technology adoption*: novas integrações entram depois que as existentes convergirem.
