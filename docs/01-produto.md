# Produto

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Este documento resume o produto; em caso de divergência, a arquitetura prevalece.

## O que é

O Forjavia é um Control Plane aberto e genérico para engenharia de software assistida por agentes de IA. Ele governa como agentes especificam, implementam, verificam e entregam software, mantendo no repositório o estado, a autoridade, o risco e as evidências que ligam esse trabalho.

O Forjavia não substitui agentes nem ferramentas de especificação e não é vinculado a domínio, linguagem, framework ou fornecedor de IA. A experiência pretendida é uma só: `Forjavia, faça X.`

## Controle de autoridade

- Implementação não é prova; prova não é autoridade para fechar.
- Quem implementa não é quem verifica.
- O Owner decide; agentes executam dentro do escopo autorizado, com permissões explícitas por efeito.
- Regras bloqueantes viram enforcement; julgamento fica com o LLM; procedimento vira script.
- O Owner não é transporte manual entre agentes. A intervenção humana ocorre em `OWNER_REQUIRED`, `STOP` material ou decisão de autoridade.

## Projeto novo

A partir do pedido do Owner, o fluxo planejado conduz especificação, esclarecimento de dúvidas, plano, tarefas, implementação e verificação independente com evidência. O Structured State do repositório é a fonte da verdade desde o início.

## Projeto existente

O Existing Project Bootstrap / Legacy Reconciliation (planejado) descobre código, documentação, backlog, decisões, testes, evidências e fontes externas temporárias. O estado declarado é confrontado com código, testes e dependências atuais; work items podem ser mantidos, reescritos, divididos, mesclados, bloqueados, descartados ou replanejados.

- Nenhuma fonte legada vira autoridade automaticamente.
- Fato, hipótese e ausência de evidência são registrados separadamente; não encontrar algo não prova que esteja errado.
- Após a reconciliação, o Structured State assume a operação e a dependência da fonte legada termina.

## Estado atual e alvo

**Atual:** baseline público inicial, arquitetura v1.3 documentada e bridge governado comprovado apenas em execução local. O transporte via GitHub/cloud é experimental. O Forjavia ainda não é instalável de ponta a ponta.

**Alvo:** Control Plane completo com Context Compiler, reconciliação de legado, integração com providers, Integrated Engineering Graph e uma única Forjavia UI. Tudo isso está planejado e ainda não existe.

## O que o Forjavia não é

Não é serviço hospedado nem SaaS. Não há versão paga, plano comercial ou open-core. O projeto é aberto; contribuições são voluntárias e apoio ou doações são opcionais.
