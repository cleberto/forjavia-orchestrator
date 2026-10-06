# Forjavia — modelo de produto e rentabilidade

## Tese do produto

O Forjavia deve ser a camada de método entre a intenção do usuário e o agente de IA que altera o projeto. Seu valor não depende de competir com o modelo que escreve código. Ele organiza contexto, seleciona o rigor adequado, prepara tarefas, aplica verificações, registra evidências e melhora o método com o uso.

Essa posição permite atender usuários de vibe coding e desenvolvedores experientes. O primeiro recebe orientação e proteção contra lacunas. O segundo recebe automação, consistência e menos trabalho repetitivo.

## Onde existe disposição para pagar

O usuário paga quando o Forjavia reduz um custo que ele já sente:

1. Retrabalho causado por contexto incompleto.
2. Tempo gasto preparando prompts e documentos repetitivos.
3. Mudanças que quebram autenticação, dados, integrações ou produção.
4. Dificuldade de retomar um projeto depois de dias ou trocar de agente.
5. Falta de evidência para decidir se uma entrega está pronta.
6. Repetição dos mesmos erros e das mesmas correções.

O produto pode capturar esse valor por assinatura e por consumo. A assinatura remunera o método, histórico, automação e conveniência. O consumo cobre execuções caras de modelos ou agentes quando o Forjavia fornecer essa infraestrutura.

## Escada recomendada de produto

### Free — aquisição e prova de valor

O Free precisa entregar um resultado completo, não uma demonstração bloqueada:

- entrevista adaptativa para projeto novo ou existente;
- tipos de projeto e cuidados por risco;
- geração de um método local em Markdown e JSON;
- conexão de um repositório autorizado pelo GitHub App;
- diagnóstico inicial somente leitura, com fatos, riscos e perguntas;
- acesso limitado ao método e ao diagnóstico por MCP remoto;
- uma quantidade pequena de projetos e revisões na nuvem;
- visualização do caminho, dúvidas pendentes e critérios de conclusão.

Objetivo comercial: fazer o usuário chegar ao primeiro resultado confiável em menos de dez minutos e perceber que pode reutilizar o método.

### Pro — automação contínua

O Pro deve cobrar por algo que economiza tempo toda semana:

- múltiplos projetos conectados ao GitHub;
- leitura incremental do projeto e atualização do diagnóstico;
- histórico e versionamento de métodos;
- roteador de risco automático por tipo de tarefa;
- uso contínuo via MCP em agentes compatíveis;
- catálogo de métodos especializados;
- gates automáticos antes de concluir uma tarefa;
- relatórios de evidência, diferenças e riscos residuais;
- modo de ensino: uma correção aprovada gera uma regra candidata e um teste de avaliação;
- limites maiores, filas prioritárias e suporte.

Preço inicial sugerido para teste: R$ 49 a R$ 89 por mês no Brasil, ou US$ 12 a US$ 19 no mercado internacional. O preço deve ser validado com usuários; não deve entrar no site como definitivo antes de medir ativação, uso e retenção.

## Onde o produto tende a ser mais rentável

Os primeiros clientes ideais têm projetos ativos e repetem o ciclo de planejamento, implementação e revisão toda semana:

- desenvolvedores independentes mantendo produtos em produção;
- pequenas agências que precisam repetir qualidade entre clientes;
- criadores de SaaS que usam mais de um agente ou alternam ferramentas;
- mantenedores de jogos online, integrações e sistemas com risco operacional;
- profissionais que receberam um projeto criado por vibe coding e precisam torná-lo sustentável.

Usuários que querem gerar um único site e nunca voltar ajudam na aquisição, mas tendem a ter baixa retenção. A rentabilidade está no trabalho recorrente: manutenção, evolução, verificação e memória do projeto.

### Cenários simples de receita

Estes números são hipóteses para planejamento, não previsão:

| Usuários ativos mensais | Conversão para Pro | Preço médio | Receita recorrente mensal |
| ---: | ---: | ---: | ---: |
| 1.000 | 4% | R$ 69 | R$ 2.760 |
| 5.000 | 5% | R$ 69 | R$ 17.250 |
| 10.000 | 6% | R$ 79 | R$ 47.400 |

O modelo se torna saudável quando a análise determinística cobre o reconhecimento inicial, o Pro usa BYOK quando precisar de modelos e qualquer inferência hospedada é limitada ou cobrada por créditos. Assim, o principal custo variável não cresce escondido dentro da assinatura. A assinatura paga o software, a sincronização, o histórico e a curadoria do método.

### Equipes — depois de provar o Pro

O plano de Equipes só deve começar quando houver uso recorrente individual:

- métodos compartilhados e aprovados;
- papéis, revisões e políticas por repositório;
- painel de conformidade e evidências;
- biblioteca privada da organização;
- integrações com tickets e CI;
- métricas agregadas de qualidade e retrabalho;
- cobrança centralizada e limites por membro.

SSO, auditoria avançada, implantação privada e SLA pertencem a uma futura oferta Enterprise, não à fase atual.

## Como eliminar a operação manual do fundador

O fluxo precisa ser produto, não consultoria:

1. **Entrada:** o usuário escolhe projeto novo ou existente e conecta uma fonte.
2. **Descoberta:** o sistema identifica stack, arquivos, riscos e lacunas sem modificar o código.
3. **Entrevista adaptativa:** perguntas aparecem apenas quando alteram uma decisão.
4. **Compilação do método:** o motor combina um núcleo comum, módulos de domínio e regras do projeto.
5. **Conexão:** o MCP remoto entrega contexto, perguntas, tarefas e critérios ao agente escolhido.
6. **Execução:** o usuário continua no agente de sua escolha e registra decisões no mesmo contrato.
7. **Validação:** gates verificam critérios, testes, segurança e evidências.
8. **Aprendizado:** correções aprovadas viram propostas de regra; nunca entram no método sem validação.

O produto deve manter duas fronteiras claras: leitura antes de escrita e aprovação humana antes de mudanças relevantes. Isso reduz risco e aumenta confiança.

## Arquitetura de serviço sugerida

- **Web app:** onboarding, entrevista, catálogo, histórico e visualização.
- **GitHub App:** acesso somente aos repositórios autorizados, leitura incremental e eventos de revisão.
- **MCP server:** ferramentas de leitura do método, seleção de workflow, registro de evidências e gates.
- **Motor de métodos:** regras determinísticas, módulos versionados, roteamento por risco e compilação de artefatos.
- **Clientes iniciais:** dois clientes MCP escolhidos por compatibilidade e demanda dos pilotos.
- **Conector local opcional:** mudanças ainda não enviadas, testes locais e projetos fora do GitHub, se a demanda justificar.
- **Serviço de execução opcional:** agentes hospedados apenas quando houver demanda comprovada.
- **Telemetria com consentimento:** mede etapas e falhas sem coletar código por padrão.

Para o Free, regras determinísticas e limites de uso controlam o custo. Para o Pro, sincronização, histórico, diagnósticos recorrentes e automações justificam a assinatura.

## Seu papel

Você entra como criador do sistema de decisão:

- define os princípios do Forjavia;
- escolhe quais riscos exigem quais gates;
- valida os primeiros módulos com projetos reais;
- entrevista usuários e observa onde o fluxo trava;
- aprova mudanças no método central;
- constrói parcerias e conteúdo que demonstram resultados.

Você não deve revisar manualmente cada projeto. Durante o início, pode acompanhar de cinco a dez usuários-piloto para transformar dúvidas recorrentes em produto. Depois disso, a plataforma absorve o conhecimento.

## Métodos estudados e como entram no Forjavia

### Spec-Driven Development

Usamos a sequência intenção, especificação, plano, tarefas, implementação e convergência. O Forjavia evita aplicar o processo inteiro a qualquer mudança: o roteador de risco reduz ou amplia as etapas conforme o impacto.

### Desenvolvimento brownfield e greenfield

Projetos existentes começam por diagnóstico, baseline e preservação de comportamento. Projetos novos começam por problema, usuário, escopo e arquitetura mínima. Misturar os dois fluxos produz perguntas e documentos desnecessários.

### Progressive disclosure

O usuário vê primeiro decisões simples. Detalhes técnicos surgem quando uma resposta os torna relevantes. Isso evita uma configuração longa antes de perceber valor.

### Risk-based workflow

O rigor é proporcional ao impacto. Mudanças em autenticação, dados, pagamentos, multiplayer ou produção recebem gates adicionais. Alterações visuais pequenas percorrem um caminho menor.

### Human-in-the-loop

A IA pode propor, analisar e executar. Decisões ambíguas, mudanças sensíveis e novas regras precisam de confirmação humana. O sistema registra onde houve aprovação.

### Testes, critérios de aceitação e evidência

Cada tarefa precisa de uma definição verificável de pronto. A conclusão deve apontar para testes, inspeções ou evidências observáveis, em vez de depender da afirmação do agente.

### Avaliações e melhoria contínua

Uma correção não vira regra automaticamente. Ela gera uma candidata, um exemplo positivo, um caso de falha e uma avaliação. O método só muda quando a avaliação mostra ganho sem regressão relevante.

### Portabilidade por MCP

O MCP expõe contexto e ferramentas de modo padronizado para clientes compatíveis. O portal preserva a experiência visual e o histórico. Um conector local só entra depois, para necessidades que GitHub e MCP remoto não cobrem.

## Métricas que provam valor

- tempo até o primeiro método aplicável;
- porcentagem de usuários que exportam ou instalam o método;
- projetos que voltam na segunda semana;
- tarefas concluídas com evidência;
- dúvidas resolvidas antes da implementação;
- regressões ou retrabalho por tarefa;
- regras candidatas aceitas e reincidências evitadas;
- custo de IA por execução Pro;
- conversão Free → Pro e cancelamento mensal.

## Sequência de construção

1. Consolidar o construtor Free e o formato aberto do método.
2. Criar conta, isolamento, projetos e um contrato versionado.
3. Conectar repositórios autorizados por GitHub App.
4. Implementar diagnóstico somente leitura com origem para cada conclusão.
5. Publicar MCP remoto com ferramentas restritas e auditáveis para dois clientes.
6. Implementar gates, evidências ligadas à revisão e histórico do Pro.
7. Validar retenção e disposição para pagar.
8. Avaliar conector local; construir Equipes apenas depois de retenção individual.

## Hipótese comercial inicial

O Free distribui o método e cria confiança. O Pro vende continuidade: conectar, diagnosticar, aplicar, verificar e aprender sem refazer a preparação a cada tarefa. O custo variável de modelos deve ser BYOK ou cobrado por créditos. Dessa forma, a margem da assinatura remunera o software e a curadoria, enquanto o consumo de IA se paga.
