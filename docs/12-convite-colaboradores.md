# Comunidade e colaboração

> O nome deste arquivo (`12-convite-colaboradores.md`) é histórico. O conteúdo substitui o antigo convite comercial e trata apenas de colaboração voluntária e aberta pelo GitHub.

## Uso livre, colaboração voluntária

O Forjavia é público e o código original está sob a licença [MIT](../LICENSE). Você pode usar, estudar, adaptar e redistribuir o projeto nos termos da licença, sem obrigação de contribuir, avisar ou manter qualquer vínculo.

Contribuir é voluntário. Participar não cria compromisso de continuidade, remuneração ou papel formal no projeto.

## Formas de participar

- **Issues:** problemas no baseline, inconsistências na documentação e propostas pontuais.
- **Discussions** (quando habilitadas no repositório): dúvidas, ideias e conversas de arquitetura antes de uma proposta grande.
- **Pull requests:** correções e melhorias pequenas, focadas e verificáveis.

Antes de abrir qualquer contribuição, leia o [CONTRIBUTING.md](../CONTRIBUTING.md) e siga os [primeiros passos](getting-started.md).

## O que esperar

- A revisão é feita pelos mantenedores no tempo disponível, sem prazo garantido.
- Mudanças são avaliadas contra a [arquitetura v1.3](architecture-v1.3.md) e contra as verificações do baseline.
- Uma proposta pode receber pedido de ajuste, ter o escopo reduzido ou ser recusada.
- Grande parte das capacidades descritas está PLANNED. Trabalho nessas áreas começa por discussão, não por um PR grande.

## O que pedimos a quem contribui

- Rodar as verificações do baseline e informar no PR os comandos e o resultado.
- Manter mudanças pequenas, com objetivo claro.
- Não declarar como implementado ou verificado algo que não foi verificado (`implementation != proof`).
- Respeitar licenças de terceiros e manter [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) e o inventário de terceiros consistentes.

## Segurança

- Não publique em issues, discussions ou PRs detalhes de vulnerabilidades, credenciais, tokens, dados pessoais ou conteúdo de repositórios privados.
- Para relatar uma vulnerabilidade, siga o [CONTRIBUTING.md](../CONTRIBUTING.md). Se não houver canal privado indicado, abra uma issue mínima pedindo um contato privado, sem detalhes técnicos.
- Princípios de conexão e segurança: [08-conexao-e-seguranca.md](08-conexao-e-seguranca.md).

## Governança de arquitetura

- A [arquitetura v1.3](architecture-v1.3.md) é a norma. Os demais documentos são projeções ou histórico.
- Mudanças em non-negotiables, ownership ou nos três planos exigem discussão prévia e decisão registrada em [06-decisoes.md](06-decisoes.md). Decisões substituídas ficam em [superseded-decisions.md](superseded-decisions.md).
- Propostas que transformem um provider em authority, criem uma segunda source of truth ou uma segunda UI operacional entram em conflito com a norma.
- Decisões de autoridade cabem ao Owner do projeto.
