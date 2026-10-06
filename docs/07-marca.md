# Forjavia — identidade e linguagem pública

Status: nome e significado aprovados pelo proprietário. Linguagem pública alinhada à [arquitetura v1.3](architecture-v1.3.md) e ao [README](../README.md).

## Significado

**Forja + via:** a construção de software (forja) conduzida por um caminho explícito (via) de conhecimento, execução e verificação.

## Apresentação

**Control Plane aberto para engenharia de software assistida por agentes.**

O Forjavia é um framework/harness genérico e público. Ele governa estado, autoridade, risco e evidências do trabalho feito por agentes. Não substitui os agentes nem as ferramentas de especificação usadas por eles.

## Regras de linguagem

- **Técnica:** descrever mecanismos concretos, como Structured State, roteamento por risco, verificação independente, evidência e proveniência, em vez de benefícios vagos.
- **Genérica:** o Core não pertence a um domínio, linguagem ou ferramenta. Especificidades de projeto ficam em configuração e pacotes separados do Core.
- **Open source:** código original sob [MIT](../LICENSE), sem versão paga, open-core comercial, contas ou serviço hospedado. Apoio e doações são opcionais.
- **Honesta sobre o estado:** usar os estados do README (DOCUMENTED / NORMATIVE, IMPLEMENTED, EXPERIMENTAL, PLANNED) e não apresentar capacidade planejada ou experimental como disponível.
- **Providers com nome e crédito:** Spec Kit, TLC Spec-Driven e Understand Anything são providers externos, com créditos em [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). Claude Code, Codex e outros agentes são executores substituíveis, não o produto.
- SDD é uma técnica usada pelo provider Spec Kit. Não define sozinha o projeto.

## Evitar

- Apresentar o Forjavia como plataforma SaaS, produto hospedado ou serviço com planos, preços ou contas.
- Reivindicar resultados (produtividade, qualidade, redução de defeitos, economia de tokens) sem evidência publicada e reproduzível.
- Prometer correção garantida, autonomia irrestrita ou aprendizado comprovado sem avaliação.
- Usar linguagem de recrutamento, captação de clientes ou pesquisa comercial.

## Nomes

- **Forjavia:** o projeto e o Control Plane.
- **Forjavia UI:** a interface humana principal definida na arquitetura. Estado atual: PLANNED.
