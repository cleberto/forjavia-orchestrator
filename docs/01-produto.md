# Produto

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Este documento resume o produto; em caso de divergência, a arquitetura prevalece.

## O que é

O Forjavia é um framework/harness e Control Plane aberto, genérico e provider-agnostic para engenharia de software assistida por agentes de IA. Ele governa como o trabalho é especificado, planejado, executado, verificado e aceito, mantendo no repositório o estado, a autoridade, o risco e as evidências que ligam esse trabalho.

O Forjavia não substitui agentes, modelos nem ferramentas de especificação e não é vinculado a domínio, linguagem, framework ou fornecedor de IA. A experiência pretendida é uma só: `Forjavia, faça X.`

## Papéis e providers

Papel (role) e provider são conceitos distintos: `role != provider`.

- **Papel** é a função no fluxo: orquestrar, especificar, planejar, executar, revisar, verificar.
- **Provider** é o que cumpre o papel: um modelo ou agente de IA, um script, testes, CI.
- Os papéis são configuráveis e substituíveis. Nenhum agente ou fornecedor específico é exigido.
- O Forjavia não é inerentemente multi-agent: pode operar com um único provider em vários papéis ou com vários providers.
- Com um único provider, `author != verifier` continua valendo por meio de contexto/sessão separados e sensores determinísticos.

Na arquitetura, o **Provider Plane** reúne providers de *capacidade* (Spec Kit, TLC, Understand Anything). Agentes e modelos de IA são providers de *execução* no Execution Plane. Nenhum deles governa o sistema; governança e autoridade ficam no Control Plane.

## Controle de autoridade

- Implementação não é prova; prova não é autoridade para fechar.
- Quem implementa não é quem verifica.
- Agentes executam apenas dentro do escopo autorizado, com permissões explícitas por efeito; decisões de autoridade permanecem humanas.
- Regras bloqueantes viram enforcement; julgamento fica com o LLM; procedimento vira script.
- Humanos não são transporte manual entre agentes. A intervenção humana ocorre quando uma decisão de autoridade é necessária ou diante de `STOP` material.

## Ciclo contínuo de feature (PLANNED)

Requisito de produto: um pedido de feature deve continuar automaticamente por contexto, avaliação de risco, especificação quando necessária, planejamento, dependências e ordem, execução, testes, reparos e revalidação/verificação independente, até a aceitação ou um blocker genuíno. Tudo ocorre dentro da autoridade concedida; o que estiver fora dela é escalado, não assumido.

Esse ciclo integrado e autônomo ainda não está comprovado e permanece **PLANNED**.

## Projeto novo

A partir de um pedido, o fluxo planejado conduz especificação, esclarecimento de dúvidas, plano, tarefas, implementação e verificação independente com evidência. A profundidade de cada etapa é proporcional ao risco. O Structured State do repositório é a fonte da verdade desde o início.

## Projeto existente

O Existing Project Bootstrap / Legacy Reconciliation (**PLANNED**) descobre código, documentação, backlog, decisões, testes, evidências e fontes externas temporárias. O estado declarado é confrontado com código, testes e dependências atuais; work items podem ser mantidos, reescritos, divididos, mesclados, bloqueados, descartados ou replanejados.

- Nenhuma fonte legada vira autoridade automaticamente.
- Fato, hipótese e ausência de evidência são registrados separadamente; não encontrar algo não prova que esteja errado.
- Após a reconciliação, o Structured State assume a operação e a dependência da fonte legada termina.

## Estado atual e alvo

**CURRENT:** baseline público inicial e arquitetura v1.3 documentada como norma.

**EXPERIMENTAL:** bridge/runner governado comprovado apenas em execução local (veja [bridge governado](13-governed-bridge.md)). O perfil usado hoje (Codex como orquestrador → Claude como executor) é apenas a configuração do ambiente de build do próprio Forjavia, não regra normativa nem requisito.

**PLANNED:** transporte via GitHub/cloud, ciclo contínuo de feature, Context Compiler completo, Lesson Distiller, Parallel Scheduler, reconciliação de legado, integração profunda com providers de capacidade, Integrated Engineering Graph e uma única Forjavia UI. Nada disso existe ainda; a ordem está no [roadmap](05-roadmap.md).

O Forjavia ainda não é instalável de ponta a ponta.

## O que o Forjavia não é

- Não é um agente nem um modelo de IA, e não exige nenhum agente ou fornecedor específico.
- Não é inerentemente multi-agent.
- Não é segunda fonte da verdade nem espelho permanente de ferramentas legadas.
- Não é produto pronto: capacidades marcadas como PLANNED não devem ser tratadas como disponíveis.

O projeto é aberto. O código original está sob a licença [MIT](../LICENSE), e materiais de terceiros mantêm suas licenças upstream, listadas em [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). Contribuições são voluntárias (veja [CONTRIBUTING.md](../CONTRIBUTING.md)); apoio ou doações são opcionais.
