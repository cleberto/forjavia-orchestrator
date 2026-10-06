# Decisões substituídas

> Norma vigente: [arquitetura v1.3](architecture-v1.3.md). Decisões vigentes: [Decisões](06-decisoes.md). Este índice é uma projeção da norma e não a substitui.

Índice breve de decisões antigas que **não estão vigentes**. Nenhum item abaixo descreve o Forjavia atual. Em caso de conflito, prevalece a [arquitetura v1.3](architecture-v1.3.md).

| Decisão antiga | Status | Direção vigente |
|---|---|---|
| Planos Free / Pro / Enterprise | SUPERSEDED | Projeto open source sob MIT, sem versão paga e sem open-core comercial |
| Assinatura, cobrança e créditos de execução | SUPERSEDED | Sem cobrança; apoio e doações são opcionais |
| Produto como SaaS / serviço web com conta obrigatória | SUPERSEDED | Sem Forjavia Cloud; repositório público no GitHub |
| Site e deploy em Cloudflare (incluindo D1) como base do produto | SUPERSEDED | Nenhuma infraestrutura hospedada faz parte da arquitetura |
| Pesquisa de validação e funil comercial como parte do produto | SUPERSEDED | Fora do escopo do Forjavia |
| Execução hospedada (hosted execution) como arquitetura atual | SUPERSEDED | Execution Plane com executores substituíveis, governados pelo Control Plane; transporte via GitHub/cloud segue em aberto |
| GitHub App e MCP remoto como canais principais de um serviço hospedado | SUPERSEDED | Possíveis adapters, não centro obrigatório (ver [Integrações](integrations.md)) |

## Documentos removidos da árvore vigente

Os documentos abaixo pertenciam à direção substituída e foram removidos da árvore pública atual:

- `docs/09-produto-e-planos.md` — produto e planos;
- `docs/10-modelo-de-negocio.md` — modelo de negócio;
- `docs/11-publicacao-cloudflare.md` — publicação em Cloudflare.

### Provenance

Origem: commit público inicial `21bd5f8e54b59b4a19d20860802673e70847c049`.

A remoção só afeta a árvore vigente. O histórico Git não foi reescrito e o texto original continua acessível nesse commit, por exemplo:

```
git show 21bd5f8e54b59b4a19d20860802673e70847c049:docs/09-produto-e-planos.md
```

Esses textos são registro histórico, não norma, e não devem ser citados como direção vigente.

## Observação

Material de pesquisa comercial, funil de aquisição ou website pessoal ligado à direção anterior não pertence ao Forjavia e não o representa.
