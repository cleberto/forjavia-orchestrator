# Segurança e permissões

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Resumo: [03-arquitetura.md](03-arquitetura.md). Bridge local: [13-governed-bridge.md](13-governed-bridge.md).

Este documento substitui a versão anterior onde ela divergia da arquitetura v1.3. Ele descreve a segurança de um Control Plane que opera sobre o repositório.

## Premissas

- Não há login, conta, tenant nem serviço hospedado do Forjavia. GitHub App e MCP remoto não são obrigatórios. Se algum deles for adotado, exigirá decisão e requisitos próprios.
- O transporte do relay via GitHub/cloud **não está comprovado**; o gate de cutover continua aberto.
- A maior parte do que segue é contrato-alvo (PLANNED). O runner local é experimental e não é produto pronto.

## Princípios

### Permission-by-effect
Permissões são concedidas por efeito, não por ferramenta nem por agente: ler caminho, escrever caminho, executar comando, acessar rede, publicar externamente. Cada Work Item declara os efeitos permitidos, e o Context Compiler entrega ao executor apenas essas permissões.

### Least privilege
- O padrão é negar.
- Caminhos e comandos ficam em allowlist; a rede é controlada; a execução é isolada.
- Escrita concorrente não isolada na mesma árvore é proibida por padrão.
- Efeitos irreversíveis ou externos (publicar, apagar, enviar) exigem `OWNER_REQUIRED`, salvo autorização durável registrada.

### Fonte não confiável
Conteúdo de repositório, documentos, fontes legadas, saídas de providers e resultados de executores são dados, não instruções. Instruções embutidas nesses conteúdos não concedem autoridade nem ampliam permissões. Conteúdo exportado ou importado também não concede autorização.

### Authority separada
Só uma decisão registrada no Structured State, por quem tem autoridade, aprova, fecha ou amplia escopo. Implementação e prova não concedem authority.

### Invalidação de evidência
Evidências e pareceres, incluindo os de segurança, ficam vinculados a caminho, hash e revisão. Quando um input muda, eles perdem validade e a verificação precisa ser refeita. Veja [verificação e evidência](verification-and-evidence.md).

### Sem segredos
Segredos não entram no Structured State, no contexto compilado, em prompts, evidências, logs ou projeções. Conteúdo que pareça credencial bloqueia o fluxo em vez de ser propagado.

### Provider adapters
Spec Kit, TLC e Understand Anything são acessados por adapters versionados com efeitos declarados. Um provider não amplia permissões nem governa o sistema, e seus resultados passam por adjudicação do Control Plane.

### Distribuição de métodos
Métodos e providers precisam de origem verificável, versão fixada e atualização com diff. Instalar algo não concede execução arbitrária.

## Executores externos
Executores como Claude Code ou Codex rodam sob as ferramentas, contratos e limites de quem os usa. Não presumir que uma assinatura de chat inclua API ou permita automação irrestrita. Nenhum custo foi estimado aqui.

## Limites desta documentação
Documentação e questionários não provam segurança. Revisões e verificações independentes continuam necessárias.

Referência: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
