# Arquitetura
## Componentes
| Componente | Papel | Estado |
|---|---|---|
| Site responsivo | Entrevista, duas jornadas, perguntas, preferências e exportação | Prévia implementada |
| Compilador de método | Gerar etapas/gates a partir das respostas | Implementado, regras iniciais |
| Schemas | Validar perfil importado e limites de entrada | Implementado para perfil v1 |
| Catálogo de métodos | Versões, compatibilidade, atualizações e personalização | Planejado |
| GitHub App | Ler somente repositórios autorizados e acompanhar revisões | Planejado, primeira conexão |
| MCP remoto | Expor contexto, método, dúvidas, planos e evidências a clientes compatíveis | Planejado, primeira integração |
| Conector local | Cobrir mudanças não enviadas, testes locais e projetos fora do GitHub | Opcional, após validar demanda |
| Serviço SaaS | Identidade, isolamento, assinatura, projetos e auditoria | Planejado |
| Pesquisa de validação | Formulário público, persistência D1 e painel privado de resultados | Implementado |

## Separação
O core não depende de motor de jogo, domínio específico, framework web específico ou fornecedor de IA.
Site, GitHub App, MCP e eventual conector local usam os mesmos contratos. Regras por domínio são módulos opcionais.
A aplicação atual usa React/TypeScript com o starter Sites; núcleo determinístico fica em web/lib/method.ts.

## Fonte da verdade
Perfil versionado + método versionado + decisões + evidências ligadas à revisão.
Pareceres perdem validade quando seus inputs mudam.
Interfaces exibem fatos, hipóteses e pendências separadamente.
Comandos são argv e nunca shell derivado de texto do usuário.

## Pesquisa de validação
As respostas são armazenadas no Cloudflare D1 sem endereço IP. Contato é opcional e depende de consentimento explícito. A leitura exige o segredo `SURVEY_ADMIN_TOKEN`; a rota do painel recebe `noindex` e não aparece na navegação pública. O banco aplica limites e listas permitidas novamente no servidor, independentemente da validação do navegador.

Os textos públicos da pesquisa ficam em um catálogo PT/EN/DE separado da lógica do formulário. Opções traduzidas mantêm valores canônicos no banco para que a análise não seja fragmentada por idioma. Um novo idioma acrescenta um pacote de textos ao catálogo e ao registro global de idiomas; não exige duplicar componentes, validação, API ou schema. Tradução automática em cada acesso não é usada, pois alteraria termos de produto e adicionaria latência e dependência externa.

## Estados futuros da execução
DRAFT → QUESTIONS_PENDING → READY_FOR_REVIEW → PLAN_ACCEPTED → EXECUTING → VERIFYING → AWAITING_ACCEPTANCE.
BLOCKED preserva causa e ponto de retomada. Aprovação prévia vale dentro do escopo autorizado; não solicitar a mesma decisão a cada passo.

## Baixa manualidade
Uma conexão por projeto, reconhecimento seletivo, perguntas agrupadas por bloqueio, retomada sem repetir respostas, atualizações com diff e rollback.
Coleta local minimiza dados enviados ao serviço. Execução respeita permissões da ferramenta hospedeira.
