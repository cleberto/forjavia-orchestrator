# Forjavia Web
Prévia interativa da plataforma. Jornadas para projeto existente e projeto do zero, perguntas pendentes, regras de risco explícitas, método em Markdown e configuração JSON reutilizável.

## Rodar
- Instalar: `npm run install:ci`
- Desenvolver: `npm run dev`
- Testar comportamento: `node --experimental-strip-types --test scripts/method.test.ts`
- Conferir tipos: `npx tsc --noEmit`
- Construir: `npm run build`

## Limites
Sem contas de clientes, cobrança, diagnóstico real de código, execução de IA ou CLI/MCP funcional. Estado só em memória; exporte o perfil para retomar.
Nenhum conteúdo do formulário é enviado a modelos externos. O roteiro é compilado deterministicamente a partir das respostas.
Importação com tamanho limitado e schema estrito. Conteúdo do usuário é renderizado como texto React.
Não coloque segredos nos campos ou arquivos exportados.

## Manutenção
`lib/method.ts` concentra schema, classificação, perguntas e geração de instruções.
`app/page.tsx` apresenta o questionário.
`app/globals.css` concentra tokens e estilos responsivos.
A evolução SaaS deve seguir os requisitos de segurança e isolamento descritos nos documentos do projeto.
