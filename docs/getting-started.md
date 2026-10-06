# Primeiros passos

> **Estado:** baseline inicial. Hoje o Forjavia **não é** um produto instalável de ponta a ponta. Não há pacote, instalador nem serviço hospedado. Este guia serve para conhecer o projeto, validar o baseline localmente e preparar uma primeira contribuição.

## O que existe hoje

- Arquitetura v1.3 documentada e normativa ([architecture-v1.3.md](architecture-v1.3.md)).
- Baseline público com licença MIT, notices, inventário de terceiros e verificações.
- Bridge/runner governado **local**, em estado EXPERIMENTAL ([13-governed-bridge.md](13-governed-bridge.md)).
- Projeto `web/` com verificações próprias.

## O que ainda não existe

- Transporte do bridge via GitHub/cloud: EXPERIMENTAL e não comprovado.
- Integrações com Spec Kit, TLC e Understand Anything: PLANNED.
- Implementação completa do Context Compiler, Legacy Reconciliation e Integrated Engineering Graph: PLANNED.
- Forjavia UI: PLANNED.

## Pré-requisitos

- Git
- Node.js >= 22.13, com npm

## 1. Clone o repositório

```bash
git clone https://github.com/cleberto/forjavia-orchestrator.git
cd forjavia-orchestrator
```

## 2. Valide o baseline na raiz

```bash
node tools/bridge/bridge.test.mjs
node tools/third-party-inventory.mjs --check
```

## 3. Valide o baseline em `web/`

```bash
cd web
npm ci
node --experimental-strip-types scripts/method.test.ts
node scripts/prepare-hosting.test.mjs
node scripts/prepare-hosting.mjs
npx tsc --noEmit --incremental false
npm run lint
npm run build
cd ..
```

Todos os comandos devem terminar sem erro. Se algum falhar em um clone limpo, isso já é uma contribuição útil: abra uma issue com o comando, a saída e as versões de Node.js e npm.

## 4. Leitura recomendada

1. [README](../README.md): visão geral e estado do projeto.
2. [Arquitetura v1.3](architecture-v1.3.md): a norma.
3. [Conceitos e estado](concepts-and-state.md).
4. [Verificação e evidência](verification-and-evidence.md).
5. [Roadmap](05-roadmap.md).
6. [Bridge governado](13-governed-bridge.md).
7. [CONTRIBUTING.md](../CONTRIBUTING.md).

## 5. Primeira contribuição

1. Leia o [CONTRIBUTING.md](../CONTRIBUTING.md) e [Comunidade e colaboração](12-convite-colaboradores.md).
2. Escolha uma issue existente ou abra uma descrevendo o problema. Para mudanças de arquitetura, discuta antes de implementar.
3. Faça um fork e crie um branch para a mudança.
4. Mantenha a mudança pequena e focada.
5. Rode novamente todas as verificações dos passos 2 e 3.
6. Abra o pull request informando objetivo, comandos executados e resultados. Não descreva como pronto algo que é EXPERIMENTAL ou PLANNED.
7. Se adicionar ou alterar material de terceiros, mantenha [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) consistente e garanta que `node tools/third-party-inventory.mjs --check` passe.
