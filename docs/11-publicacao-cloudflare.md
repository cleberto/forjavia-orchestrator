# Publicação no Cloudflare

O portal é compilado como Cloudflare Worker com Static Assets pelo Vinext. A publicação atual não usa banco, R2, KV, login ou Workers AI.

## Pré-requisitos

- Node.js compatível com o `package.json`;
- dependências instaladas com `npm ci`;
- Wrangler autenticado com `npm exec wrangler login`;
- acesso ao Worker `forjavia` na conta Cloudflare.

## Validação local

No diretório `web/`:

```text
npm ci
npm test --if-present
npm run build
```

Os testes do motor usam atualmente:

```text
node --experimental-strip-types --test scripts/method.test.ts
```

## Deploy manual

```text
npm run deploy
```

O script recompila a aplicação e publica `dist/server/wrangler.json` com o nome `forjavia`. A URL `workers.dev` é exibida pelo Wrangler ao final.

## CI/CD futuro

A integração contínua deve ser configurada por Workers Builds conectado à branch `main`, ou por GitHub Actions com token restrito. Nunca registrar token, account ID sensível ou credencial no repositório.

Pipeline mínimo:

1. `npm ci`;
2. testes;
3. validação de tipos;
4. build;
5. verificação de segredos e dependências;
6. deploy de preview;
7. promoção para produção.

## Limites relevantes do Free

Antes de adicionar backend, autenticação ou execução de agentes, conferir novamente os limites oficiais. A fase atual usa principalmente Static Assets e renderização leve. Diagnóstico de repositório, filas, armazenamento e IA não devem ser acrescentados sem orçamento e medição.

## Rollback

Cada publicação cria uma versão do Worker. Em caso de regressão, restaurar a versão anterior no painel ou pelo Wrangler e registrar a causa antes de tentar nova promoção.
