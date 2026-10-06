# Consumo dos métodos, segurança e custos
## Proposta de experiência
O cliente responde no site e conecta seu projeto uma vez. O agente recebe o método, examina o escopo autorizado, devolve dúvidas e evidências, e retoma após respostas.
Exportação de arquivos na prévia é uma ponte; não é o objetivo final de baixa manualidade.

## MCP-first, GitHub e conector local
MCP é a primeira interface de ferramentas e contexto para agentes compatíveis; não substitui sozinho motor, autorização ou diagnóstico.
A GitHub App é a primeira fonte do projeto e será instalada separadamente do login, somente nos repositórios escolhidos.
O servidor MCP entrega contexto, regras, dúvidas e planos e recebe decisões e evidências. Começar com dois clientes reais e um fluxo completo reduz o custo de integração.
Um conector local permanece opcional para alterações não enviadas, testes locais e projetos fora do GitHub. Ele só entra depois de demanda comprovada.

Referência primária: https://modelcontextprotocol.io/docs/learn/architecture
A documentação do MCP descreve comunicação entre hosts, clientes e servidores e exposição de ferramentas/contexto. O custo real vem da implementação e operação, não do nome do protocolo.

## Custo sem promessas
- IA do usuário executando localmente: consumo e limites dependem da ferramenta e contrato dele; o Forjavia ainda tem custos de produto, suporte e integração.
- IA hospedada pelo Forjavia: acrescenta tokens, execução, filas, armazenamento e abuso.
- Conector local opcional: exige distribuição, compatibilidade e manutenção.
- MCP remoto: acrescenta autenticação, operação, observabilidade e limites.
- Não presumir que assinatura de chat inclui API ou permite automação irrestrita.
Medir custo por execução antes de definir plano comercial. Não foram estimados preços nesta entrega.

## Segurança por fase
Na demonstração pública: sem conta de cliente, conexão de repositório, execução remota, credenciais ou persistência de projetos. Perfil local limitado a 64 KB, schema estrito e renderização de texto. Conteúdo exportado não concede autorização.
Antes do SaaS: autenticação, autorização por recurso e tenant no servidor, testes de acesso cruzado, CSRF conforme autenticação escolhida, limites, secrets manager, auditoria e política de retenção.
Antes de executar: allowlist de caminhos e comandos, isolamento, controle de rede, proteção contra instruções maliciosas em repositórios e revisão dos efeitos de cada ferramenta.
Métodos distribuídos precisam de origem verificável, versões fixadas e atualização com diff; nenhum pacote recebe execução arbitrária por instalar.
O questionário não prova segurança. Revisões e verificações independentes continuam necessárias.

Referências:
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html
