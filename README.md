# Forjavia
**Confiança para software desenvolvido com IA.**

Forja + via: construir com método e um caminho definido.

Plataforma MCP-first para diagnosticar projetos, organizar contexto e riscos e reunir evidências usando o agente de IA que cada pessoa já escolheu.

**Especialização inicial:** projetos existentes, herdados ou pouco documentados, nos quais pessoas e IAs precisam compreender o contexto antes de alterar o código. O núcleo permanece aplicável a projetos novos e a diferentes domínios.

Forjavia mantém o Core genérico; conhecimento e regras de domínio pertencem às instâncias de projeto.

## Versão pública

- Portal: [forjavia.clebertow.workers.dev](https://forjavia.clebertow.workers.dev)
- Ambiente: prévia pública para testes no Cloudflare Workers Free

## O que existe

- Prévia web responsiva em `web/`.
- Interface em português, inglês e alemão, com detecção do navegador e troca manual.
- Jornadas de projeto existente e projeto do zero.
- Questionário, dúvidas pendentes e sequência de trabalho adaptada.
- Regras explícitas por fatores de risco informados.
- Exportação do método em Markdown e perfil JSON reutilizável.
- Testes da geração, validação de perfil e importação.
- Pesquisa pública de validação em `/pesquisa`, com respostas persistidas no Cloudflare D1.
- Painel privado e não indexável em `/pesquisa/resultados`, protegido por chave e com exportação CSV.

A prévia não acessa repositórios, não diagnostica gaps reais, não executa agentes, não tem MCP, contas de clientes ou cobrança. A demonstração pública mantém estado somente na sessão; o perfil pode ser exportado para retomar.

## Documentação

O código original usa [MIT](LICENSE). Materiais incorporados preservam suas próprias licenças e attribution em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); o inventário do lockfile está em [docs/third-party-inventory.json](docs/third-party-inventory.json). O gate de publicação exige revisão do artefato efetivamente distribuído.

1. [Produto e jornadas](docs/01-produto.md)
2. [Origem do método](docs/02-origem.md)
3. [Arquitetura](docs/03-arquitetura.md)
4. [Requisitos](docs/04-requisitos.md)
5. [Roadmap público](docs/05-roadmap.md)
6. [Decisões](docs/06-decisoes.md)
7. [Marca](docs/07-marca.md)
8. [Conexão, MCP, segurança e custos](docs/08-conexao-e-seguranca.md)
9. [Produto e planos](docs/09-produto-e-planos.md)
10. [Modelo de negócio](docs/10-modelo-de-negocio.md)
11. [Publicação no Cloudflare](docs/11-publicacao-cloudflare.md)
12. [Conversa com possíveis colaboradores](docs/12-convite-colaboradores.md)

O pacote específico de MU Online foi retirado da árvore genérica. O Forjavia mantém apenas capacidades de domínio reutilizáveis; a decisão e a procedência da retirada estão em `docs/15-owner-cutover-decision.md`.
