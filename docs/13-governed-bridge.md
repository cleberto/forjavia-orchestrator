# Ponte local governada — bootstrap portátil

Esta é uma ferramenta interna de bootstrap, não uma funcionalidade da prévia web nem uma integração SaaS. O Control Plane continua sendo o Forjavia. A arquitetura alvo está em docs/architecture-v1.3.md; o estado implementado da prévia permanece em docs/03-arquitetura.md.

## Executar

Requer Node compatível com ESM e Claude Code CLI instalado. O runner procura o executável no PATH; CLAUDE_EXECUTABLE pode apontar para um executável local. Nenhum caminho de usuário está embutido no código.

1. Crie uma task UTF-8, uma autorização JSON single-use e uma ação JSON. Referências são relativas à raiz do repositório e têm SHA-256 em maiúsculas. A autorização limita execution_id, task, contexto, saída create-only, unidades materiais e arquivos alterados. O runner reserva três arquivos próprios (estado, resultado e adjudicação) no limite de cinco.
2. Execute: node tools/bridge/bridge.mjs <relative-action-json>
3. Inspecione resultado e artefato. Codex, como verificador distinto do Claude autor, executa: node tools/bridge/bridge.mjs adjudicate <execution_id>
4. Em contexto novo: node tools/bridge/bridge.mjs recover <execution_id>. O estado em runtime/bridge/<execution_id>/ é canônico para a execução local e não substitui a decisão de autoridade.

Claude é invocado sem ferramentas, em modo restrito e não interativo. Ele devolve resultado estruturado; só o runner grava a saída permitida. Uma autorização finalizada não pode ser reutilizada. CONTINUE exige nova execução e autoridade correspondente. RETRY só ocorre após falha diagnosticada. Duas falhas da mesma classe param o loop e criam pacote de aprendizado. OWNER_REQUIRED é reservado a decisão genuína de autoridade ou produto. STOP encerra a execução.

## Limites

- Escopo desta fase: FORJAVIA_BOOTSTRAP_AND_GITHUB_PREPARATION. O código não concede autoridade por si só.
- Até cinco unidades materiais e cinco arquivos alterados por wave; o primeiro limite atingido prevalece.
- Sem scheduler paralelo, ferramentas do Claude, mutação remota, push, publicação ou acesso a segredos por esta ponte.
- runtime/bridge/ contém estado local e fica fora de publicação automática. Para retomar em outro ambiente, produza pacote de continuidade com objetivo, autoridade, resultado/adjudicação, retry, failure packet e próxima ação. Não dependa do histórico do chat.
- Uso em cloud exige autoridade específica e configuração externa para provider/credenciais. O PATH da máquina de bootstrap não é requisito do produto.

Testes locais: node tools/bridge/bridge.test.mjs. A prova L1–L5 e a primeira wave real permanecem no runtime/bridge do repositório Orquestrador como evidência histórica; esse caminho não é dependência de execução deste repositório.
