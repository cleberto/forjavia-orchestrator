# Decisões
## Confirmadas pelo proprietário em 27/09/2026
- Marca Forjavia: forja + via.
- Plataforma web para diferentes cenários, incluindo desenvolvimento web e vibe coding.
- MU/Unity apenas como modelo de processo para desenvolver e estruturar o Forjavia.
- Experiência segura, inovadora, com bom design e totalmente responsiva.
- Fácil aplicação, replicação, manutenção e evolução.
- Duas entradas: projeto em andamento e projeto do zero.
- Perguntas para esclarecer incertezas; diagnóstico, gaps, melhorias e roadmap para projetos existentes.
- Opções visuais e decisões guiadas antes de estruturar projetos novos.
- Baixa manualidade; MCP é a primeira interface de integração e GitHub App é a primeira fonte de projeto.
- Todo uso do produto exige conta; a demonstração pública permanece acessível sem criar dados reais.
- A pesquisa pública de validação pode ser respondida sem conta; ela não acessa projetos e coleta contato apenas de forma opcional.
- O CLI volta ao escopo como proposta futura de conveniência (`forjavia init` e sincronização local), sem substituir o MCP como interface principal para agentes. Sua prioridade depende da pesquisa e dos pilotos.

## Escolhas desta implementação
- Prévia funcional do onboarding, sem simular análise real de código.
- Geração inicial determinística; perfil exportável e instruções consumíveis pela IA.
- MCP remoto primeiro, com portal e GitHub App. Conector local é opcional e depende de demanda comprovada.
- React/TypeScript no site, regras em módulo isolado.
- Publicação da prévia com acesso privado.
- Código original do Forjavia sob MIT, com notices/licenças de upstream preservados (Owner, 2026-10-06).
- `origin/main` é o destino planejado do cutover; push, release e rewrite remoto exigem autoridade separada.
- Pacotes de domínio específicos pertencem às instâncias de projeto, fora do Core genérico.

## Ainda em aberto
Primeiros dois clientes MCP; catálogo comercial de métodos; planos/preços; identidade e provedor de autenticação do SaaS; política de retenção; conector local e versão dos contratos.
A disponibilidade jurídica da marca continua pendente.

## Decisões anteriores substituídas
A visão inicial de CLI antes do site e de um domínio específico como foco principal foi corrigida pelo proprietário.
