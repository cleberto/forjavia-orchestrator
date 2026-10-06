# Decisões

## Vigentes (Owner)

- O Forjavia é um projeto open source genérico: Control Plane para engenharia de software assistida por agentes, sem vínculo a domínio, linguagem ou fornecedor de IA.
- Sem serviço hospedado, sem versão paga e sem open-core comercial. Apoio e doações são opcionais.
- Contribuição é voluntária: quem participa não assume obrigação nem compromisso de continuidade.
- Código original sob MIT; materiais de terceiros mantêm licenças e créditos em `THIRD_PARTY_NOTICES.md` (Owner, 2026-10-06).
- O repositório público parte de uma história limpa; histórico interno anterior não é publicado.
- A [arquitetura v1.3](architecture-v1.3.md) é a norma: Forjavia como único Control Plane; Spec Kit, TLC e Understand Anything como providers; Structured State como fonte da verdade; uma única Forjavia UI futura.
- Pacotes de domínio específico pertencem a instâncias de projeto, fora do core genérico.
- Push, release e reescrita remota exigem autoridade separada do Owner.

## Substituídas

A direção anterior está superada e não vale mais:

- produto como serviço web/SaaS com conta obrigatória;
- planos Free e Pro, cobrança, créditos de execução hospedada e catálogo comercial de métodos;
- infraestrutura Cloudflare (incluindo D1) como base do produto;
- pesquisa pública de validação como parte do produto;
- GitHub App e MCP remoto como canais principais de um serviço hospedado;
- referências a domínios ou projetos específicos como modelo do produto.

Documentos ou código remanescentes dessa direção são históricos e não descrevem o produto atual.

## Em aberto

Detalhes de contratos e adapters com providers, formato do Structured State e transporte do bridge via GitHub/cloud, a definir conforme o roadmap da arquitetura v1.3. A disponibilidade jurídica da marca continua pendente.
