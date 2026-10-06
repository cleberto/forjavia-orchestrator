# Roadmap do Forjavia

O roadmap é guiado por gates verificáveis. Datas entram depois do piloto; neste estágio, dependências e critérios de saída são mais confiáveis do que prazos artificiais.

## Princípios transversais

- integração MCP-first e acesso explícito;
- leitura antes de escrita;
- evidência antes de conclusão;
- menor privilégio e permissões explícitas;
- aprovação humana para decisões sensíveis;
- um único motor de métodos para Web, GitHub App, MCP e eventual conector local;
- nenhuma promessa de ganho sem baseline e medição.

## Fase 00 — Validar o método

Consolidar o construtor Free, o formato aberto e as jornadas para projeto novo e existente.

**Gate:** usuários conseguem gerar, entender e aplicar um método sem intervenção manual do fundador.

## Fase 01 — Conta e contrato versionado

Implementar identidade, persistência e isolamento. Definir o contrato do método antes dos canais de integração.

- login social e por e-mail;
- projetos e métodos por usuário;
- exportação e exclusão de dados;
- schema versionado compartilhado pelo portal e MCP.

**Gate:** usuários permanecem isolados e o mesmo perfil produz o mesmo método em qualquer canal.

## Fase 02 — GitHub App e diagnóstico com evidência

Conectar somente repositórios escolhidos. Identificar stack, estrutura, riscos, gaps e dúvidas. Cada afirmação relevante deve apontar para a origem observada ou registrar explicitamente que permanece incerta.

**Gate:** nenhum problema é apresentado como fato sem evidência.

## Fase 03 — MCP remoto

Expor contexto, regras, dúvidas, planos e registro de evidências para dois clientes MCP. O agente recebe somente o contexto necessário para o trabalho atual.

**Gate:** trocar de agente não muda o contrato nem perde decisões; tokens são revogáveis e limitados ao projeto.

## Fase 04 — Serviço Pro

Adicionar conta, projetos sincronizados, histórico, catálogo, limites, telemetria consentida e cobrança. BYOK continua disponível; execução hospedada usa créditos separados.

**Gate:** retenção, custos e unidade de valor justificam a assinatura.

## Fase 05 — Verificação e modo de ensino

Relacionar commit, pull request, teste, gate e evidência. Correções aprovadas geram regras candidatas e avaliações.

**Gate:** evidência obsoleta é recusada e nenhuma regra entra no método sem avaliação.

## Fase 06 — Equipes

Adicionar biblioteca privada, papéis, aprovações, políticas, integrações com tickets e CI e métricas agregadas.

**Gate:** o Pro demonstra uso recorrente individual antes de iniciar colaboração paga.

## Maior decisão arquitetural

O contrato versionado do método é a fundação. Web, GitHub App e MCP são canais. Se regras de risco, gates e artefatos forem implementados separadamente em cada canal, o produto ficará caro de manter e produzirá resultados divergentes.

## Segurança

Segurança não é uma fase isolada. Login e acesso ao GitHub são consentimentos separados. Cada ferramenta MCP declara o que lê, escreve e registra. O diagnóstico começa somente leitura. Segredos ficam excluídos por padrão.

## Métricas de avanço

- tempo até o primeiro método aplicável;
- taxa de exportação ou instalação;
- retorno do usuário na segunda semana;
- tarefas concluídas com evidência;
- dúvidas descobertas antes da implementação;
- retrabalho e reversões por tarefa;
- custo de execução Pro;
- conversão Free para Pro e cancelamento mensal.
