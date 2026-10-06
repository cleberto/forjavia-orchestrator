# Ponte governada — método portátil e transporte local

Este documento descreve, para contribuidores, o método de relay governado do Forjavia e a implementação local usada hoje no bootstrap. A norma é [docs/architecture-v1.3.md](architecture-v1.3.md), seção Governed Agent Relay / Bootstrap Gate. Este documento não altera a norma. Se houver conflito, vale a arquitetura.

O Forjavia é o único Control Plane. A ponte não concede autoridade, não é source of truth do projeto e não cria um orquestrador concorrente.

## Role não é provider

- `ROLE != PROVIDER`. Role é uma função no fluxo, como Orchestrator, Executor ou Verifier/Adjudicator. Provider é o executor concreto que ocupa essa função no Execution Plane, como um agente, uma CLI, um modelo, um script ou CI.
- O Forjavia pode usar um único provider em várias roles ou vários providers em roles diferentes.
- O mapeamento entre role e provider é configuração do projeto. Não é regra de arquitetura nem está fixo no código do método.
- O produto não é inerentemente multi-agent. Nenhum provider específico é obrigatório para usar o método.
- O invariante `author != verifier` continua valendo. A adjudicação precisa ser independente de quem produziu o resultado. Quando um mesmo provider ocupa as duas roles, a independência precisa vir da configuração, por exemplo com execução e contexto separados e checagens determinísticas. A ponte local atual só exercitou adjudicação por um provider distinto do autor. Outras formas de garantir independência ainda não foram provadas.

## Método

`Orchestrator/Control Plane → governed action/runner ou transport adapter → Executor → structured result/evidence → independent adjudication → CONTINUE / RETRY / OWNER_REQUIRED / STOP`

1. **Orchestrator/Control Plane:** define o objetivo, a autoridade, o escopo, os limites e o contexto compilado da ação.
2. **Governed action/runner ou transport adapter:** valida a autorização, entrega a ação ao Executor e é o único componente que materializa saídas permitidas.
3. **Executor:** realiza o trabalho dentro do escopo e devolve um resultado estruturado. O Executor não se autoriza e não se autoaprova.
4. **Structured result/evidence:** resultado machine-readable com evidência. Implementação não é prova.
5. **Independent adjudication:** um verificador independente do autor avalia o resultado e a evidência. Prova não é autoridade para fechar.
6. **Decisão:**
   - `CONTINUE`: o resultado foi aceito. O próximo passo exige nova execução, coberta pela autoridade correspondente.
   - `RETRY`: só ocorre depois de uma falha diagnosticada. A repetição de falhas da mesma classe interrompe o loop.
   - `OWNER_REQUIRED`: reservado a uma decisão genuína de autoridade ou de produto.
   - `STOP`: encerra a execução.

No fluxo normal, nenhum humano transporta prompts ou resultados entre roles. A intervenção humana ocorre apenas em `OWNER_REQUIRED`, em `STOP` material ou em decisão de autoridade.

## Portabilidade e transporte

- `METHOD_IS_PORTABLE`: o método independe do transporte e do provider.
- `LOCAL_BRIDGE != CLOUD_TRANSPORT`: a ponte local é um transport adapter específico do ambiente de build. Ela não representa o transporte em cloud.
- O transporte em cloud **não está provado**. Para o cutover local→GitHub/cloud, a arquitetura exige provar ao menos: resultado machine-readable, adjudicação pelo Orchestrator, as quatro decisões, bloqueio de execução não autorizada, persistência de estado entre contextos e uma wave real governada end-to-end.
- O uso em cloud exige autoridade específica e configuração externa de provider e credenciais.

## Autonomia multi-task (PLANNED)

Target planejado: o Orchestrator encadeia várias tasks de forma autônoma, para que o usuário não precise acionar cada task individualmente. Essa autonomia fica sempre dentro da autoridade concedida e respeita os limites de cada autorização, os gates, as permissões e o `author != verifier`. O encadeamento para em `OWNER_REQUIRED`, em `STOP` ou quando a autoridade ou os limites se esgotam. A execução paralela continua subordinada ao Parallel Scheduler condicional da arquitetura.

Estado atual: **não implementado**. A ponte local executa uma autorização por execução, e `CONTINUE` exige uma nova execução autorizada.

## Implementação local atual (detalhe de implementação)

Esta é uma ferramenta interna de bootstrap. Os detalhes abaixo valem para este transport adapter local e não são contrato do produto.

### Executar

Requer Node compatível com ESM e o executável do provider configurado para a role de Executor. No perfil atual, esse executável é o Claude Code CLI, procurado no PATH. `CLAUDE_EXECUTABLE` pode apontar para um executável local. Nenhum caminho de usuário está embutido no código, e o PATH da máquina de bootstrap não é requisito do produto.

1. Crie uma task UTF-8, uma autorização JSON single-use e uma ação JSON. As referências são relativas à raiz do repositório e levam SHA-256 em maiúsculas. A autorização limita execution_id, task, contexto, saída create-only, unidades materiais e arquivos alterados. O runner reserva três arquivos próprios (estado, resultado e adjudicação) dentro do limite de cinco.
2. Execute: `node tools/bridge/bridge.mjs <relative-action-json>`
3. Inspecione o resultado e o artefato. O verificador independente do autor executa: `node tools/bridge/bridge.mjs adjudicate <execution_id>`
4. Em um contexto novo, execute `node tools/bridge/bridge.mjs recover <execution_id>`. O estado em `runtime/bridge/<execution_id>/` é canônico para a execução local, mas não substitui a decisão de autoridade.

O Executor é invocado sem ferramentas, em modo restrito e não interativo, e devolve um resultado estruturado. Só o runner grava a saída permitida. Uma autorização finalizada não pode ser reutilizada. Duas falhas da mesma classe param o loop e geram um pacote de aprendizado.

### Perfil experimental Codex→Claude

A configuração atual usa Codex como Orchestrator/adjudicador e Claude Code como Executor. Esse é um **perfil experimental, válido somente no ambiente local de build**. Não é regra normativa nem necessidade do produto. Nenhuma das duas ferramentas é obrigatória, e o mapeamento de roles pode ser outro em qualquer projeto.

## Limites

- Escopo desta fase: `FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION`. O código não concede autoridade por si só.
- Até cinco unidades materiais e cinco arquivos alterados por wave. Prevalece o primeiro limite atingido.
- Esta ponte não tem scheduler paralelo e não oferece ferramentas ao Executor, mutação remota, push, publicação ou acesso a segredos.
- `runtime/bridge/` guarda estado local e fica fora da publicação automática. Para retomar em outro ambiente, produza um pacote de continuidade com objetivo, autoridade, resultado/adjudicação, retry, failure packet e próxima ação. Não dependa do histórico do chat.
- A prova L1–L5 e a primeira wave real governada existem como evidência histórica fora deste repositório. Elas não são dependência de execução daqui.

Testes locais: `node tools/bridge/bridge.test.mjs`.
