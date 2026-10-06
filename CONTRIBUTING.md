# Contribuindo com o Forjavia

Obrigado pelo interesse no Forjavia. Este guia explica como contribuir com um projeto aberto e genérico que ainda está em fase inicial de baseline.

## Contribuição voluntária

Toda contribuição é **voluntária**. Contribuir não cria obrigação, compromisso de continuidade, vínculo nem exigência de disponibilidade. Você pode abrir uma única issue, enviar uma única pull request ou só participar de uma discussão, e isso já é bem-vindo.

O código original do Forjavia está sob a licença MIT. Envie apenas conteúdo que você tem direito de usar e cuja proveniência você consegue indicar (veja [Licença e materiais de terceiros](#licença-e-materiais-de-terceiros)).

O Forjavia não tem versão paga nem open-core comercial. Apoio e doações são opcionais e não dão prioridade nem autoridade sobre decisões do projeto.

## Canais

Use os recursos do GitHub do repositório **quando estiverem habilitados**:

- **Issues:** bugs, problemas de documentação e propostas concretas.
- **Discussions:** dúvidas, ideias ainda abertas e conversas sobre arquitetura antes de virar proposta formal.
- **Pull requests:** mudanças de código ou documentação.

Se algum desses recursos não estiver habilitado, use o canal disponível mais próximo (por exemplo, uma issue no lugar de uma discussão). **Nunca** use canais públicos para vulnerabilidades; veja [Segurança](#segurança).

## Antes de começar

1. Leia o [README.md](README.md), em especial a seção **Estado do projeto**.
2. Leia a arquitetura normativa em [docs/architecture-v1.3.md](docs/architecture-v1.3.md).
3. Consulte também [docs/03-arquitetura.md](docs/03-arquitetura.md), [docs/06-decisoes.md](docs/06-decisoes.md) e o [roadmap](docs/05-roadmap.md).
4. Se você usa agentes de IA, o [AGENTS.md](AGENTS.md) traz orientações de trabalho. Elas também valem para pessoas.

Você **não precisa** usar nenhuma ferramenta específica para contribuir. Claude Code, Codex, outros agentes ou edição manual são igualmente aceitos. O que importa é o resultado e a evidência apresentada.

## Código atual versus planos

O Forjavia hoje é principalmente **arquitetura documentada e normativa (v1.3)**. Pouca coisa está implementada. Ao contribuir:

- **Não descreva planos como funcionalidade existente.** Context Compiler (implementação completa), Lesson Distiller, Parallel Scheduler, Existing Project Bootstrap, integração profunda com Spec Kit/TLC/Understand Anything, Integrated Engineering Graph e Forjavia UI estão **PLANNED**.
- O bridge/runner governado local é **EXPERIMENTAL**. O transporte via GitHub/cloud **não está comprovado**.
- Não descreva configuração documental como mecanismo implementado ou como enforcement.
- Em textos e PRs, deixe claro o que é **fato** (verificável no repositório), o que é **proposta** e o que é **decisão** já registrada. Uma proposta, mesmo aprovada em revisão, não vira decisão do proprietário automaticamente.

## Escopo

O Forjavia mantém um **Core genérico**. Contribuições são bem-vindas quando:

- corrigem bugs, testes ou documentação do que existe;
- aproximam o código do que a arquitetura v1.3 define, sem pular etapas do roadmap;
- melhoram verificações, evidências ou clareza sem duplicar source of truth.

Contribuições tendem a ficar fora de escopo quando:

- trazem para o Core fontes, regras ou assets específicos de um projeto sem proveniência, direito de uso e revisão próprios;
- criam uma segunda UI operacional, um segundo orquestrador ou outra source of truth paralela ao Structured State;
- tornam um tracker, board ou documento externo uma dependência permanente;
- adotam tecnologia nova de grande porte antes da convergência da integração atual.

Nenhum domínio específico define o Core. Exemplos de projetos servem apenas para ilustrar os contratos genéricos.

## Pull requests pequenas

Prefira **PRs pequenas e focadas**:

- uma mudança lógica por PR;
- descrição curta do problema, da solução e do que foi verificado;
- sem refatorações não relacionadas misturadas à mudança principal;
- preserve arquivos existentes; inicialização e instalação devem recusar colisões por padrão.

Se a mudança for grande, abra antes uma issue ou discussão para combinar a divisão em etapas.

### Limites das waves governadas internas

O fluxo governado interno do projeto (Orchestrator → runner → Executor → resultado estruturado → adjudicação) usa como referência waves de **até 5 unidades de trabalho e até 5 arquivos** alterados. Esse limite vale para as waves governadas internas e **não é imposto automaticamente** a toda PR da comunidade. Ainda assim, é uma boa referência de tamanho: PRs nessa faixa costumam ser revisadas mais rápido.

## Testes e verificação

Pré-requisitos: Git e Node.js ≥ 22.13 com npm, conforme o campo `engines` de [web/package.json](web/package.json). Essa versão também suporta `--experimental-strip-types`.

Na **raiz** do repositório:

```bash
node tools/bridge/bridge.test.mjs
node tools/third-party-inventory.mjs --check
```

Em **`web/`**:

```bash
cd web
npm ci
node --experimental-strip-types scripts/method.test.ts
node scripts/prepare-hosting.test.mjs
node scripts/prepare-hosting.mjs
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

Orientações:

- Rode os comandos relevantes antes de abrir a PR. Todos devem terminar sem erro.
- Valide de forma **proporcional ao comportamento alterado**. Uma correção de texto não exige o mesmo que uma mudança no bridge.
- Na descrição da PR, liste **o que você executou e o resultado**, e também **o que não executou** e por quê. Omitir uma verificação é aceitável; esconder a omissão não é.
- Se você adicionar comportamento, adicione ou ajuste testes que o cubram.
- Implementação não é prova: código escrito não substitui a evidência de que ele funciona.

## Revisão e autoridade

O projeto segue os princípios da arquitetura:

- `implementation != proof`
- `proof != authority to close`
- `author != verifier`

Na prática:

- Quem abre a PR não declara a própria revisão como independente. Revisão independente só existe quando há um revisor distinto do autor.
- Um parecer fica obsoleto quando os inputs mudam. Se a PR for alterada depois da revisão, a evidência anterior não aprova a nova versão.
- Testes passando (PASS) não ampliam permissões nem escopo. Fechar ou mesclar continua sendo decisão de quem mantém o projeto.

## Propostas arquiteturais

Propostas que alteram arquitetura, contratos ou fluxo devem:

1. **Mostrar alinhamento com [docs/architecture-v1.3.md](docs/architecture-v1.3.md):** indicar quais seções, princípios e non-negotiables a proposta respeita, toca ou altera.
2. **Respeitar governance/authority:** governança, autoridade, permissões, estado, risco e roteamento ficam no Control Plane do Forjavia. Providers e executores não governam o sistema. A proposta deve explicar como preserva essa separação e passar pela análise de governança e autoridade do projeto antes de ser tratada como decisão.
3. **Não duplicar source of truth:** o Structured State versionado no repositório continua sendo a verdade. UI, `CLAUDE.md`, `AGENTS.md`, prompts e payloads são projeções.
4. **Indicar o impacto no roadmap:** em qual etapa a proposta se encaixa e se depende de algo ainda planejado.

Comece por uma discussão ou issue. Uma proposta só vira decisão quando registrada pelos mantenedores (por exemplo, em [docs/06-decisoes.md](docs/06-decisoes.md)).

## Novas integrações e providers

Qualquer nova integração, adapter, provider, executor ou sensor precisa declarar:

- **Função:** que papel cumpre e em qual plano atua (Control Plane, Provider Plane ou Execution Plane).
- **Permissões:** o que lê, escreve, executa ou acessa na rede, e quais efeitos pode causar.
- **Evidência:** que resultado estruturado ou evidência produz e como ela pode ser verificada. Inferência semântica é apenas *advisory*; só fatos estruturais verificáveis podem virar candidatos a evidência.
- **Testes:** como a integração é testada e como reproduzir os testes localmente.
- **Licença:** licença da integração e de suas dependências, com proveniência e compatibilidade com o projeto.

Extrair ou reutilizar código de outro projeto exige inspeção de dependências, testes e compatibilidade, além do registro de proveniência.

## Bugs

Abra uma **issue** com:

- o que você esperava e o que aconteceu;
- passos para reproduzir;
- versão do Node.js, sistema operacional e commit usado;
- saída relevante dos comandos, **sem segredos**.

## Segurança

**Não divulgue vulnerabilidades publicamente** em issues, discussions, PRs ou commits.

- Se o repositório tiver o **relato privado de vulnerabilidades do GitHub** habilitado (aba *Security*), use esse canal.
- Se não estiver habilitado, **não publique detalhes**. Procure os mantenedores por um canal privado disponível. Se precisar abrir algo público para pedir contato, escreva apenas que deseja reportar uma questão de segurança, sem descrever o problema.

Em qualquer contribuição:

- não exponha segredos, tokens ou credenciais em código, logs, evidências ou artefatos;
- não copie `.env`, credenciais, assets proprietários ou logs de forma indiscriminada;
- revise diffs e anexos antes de publicar.

## Licença e materiais de terceiros

- O código original do Forjavia está sob a licença [MIT](LICENSE).
- Materiais de terceiros **mantêm suas próprias licenças e créditos**, listados em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Não remova nem altere notices existentes.
- Ao incorporar material de terceiros, revise a licença, a proveniência e o notice do material efetivamente incorporado e registre-os em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) quando aplicável.
- Ao adicionar ou alterar dependências do lockfile, rode `node tools/third-party-inventory.mjs --check`. Esse checker verifica o inventário das dependências do lockfile e não substitui a revisão de outros materiais de terceiros.
- Não envie conteúdo que você não tem direito de usar e de contribuir.

## Idioma

A documentação e as discussões do projeto são em **português do Brasil**. Identificadores de código podem estar em inglês.

## Conduta

Seja respeitoso, objetivo e paciente. Todos aqui contribuem de forma voluntária. Críticas devem ser sobre o trabalho, nunca sobre as pessoas.
