export const surveyOptions = {
  profile: ["Desenvolvedor", "Líder técnico ou arquiteto", "Fundador ou responsável por produto", "Designer ou profissional de produto", "Aprendendo a desenvolver com IA", "Tenho uma ideia, mas não sou da área", "Outro"],
  aiUsage: ["Diariamente", "Algumas vezes por semana", "Ocasionalmente", "Ainda não, mas pretendo", "Não utilizo"],
  decisionDifficulty: ["Frequentemente", "Algumas vezes", "Raramente", "Nunca", "Ainda não consigo avaliar"],
  problems: ["Documentação desatualizada", "Regras conhecidas por uma pessoa", "Dificuldade para entender o projeto", "IA alterando código sem contexto", "Retrabalho por decisões não registradas", "Dificuldade para encontrar riscos", "Dependência de desenvolvedor ou fornecedor", "Falta de critérios de conclusão", "Prompts e instruções espalhados", "Outro"],
  decisionValue: ["Muito valor", "Bastante valor", "Algum valor", "Pouco valor", "Nenhum valor"],
  benefits: ["Entender um projeto existente", "Organizar uma ideia", "Encontrar riscos e lacunas", "Criar um roadmap confiável", "Manter documentação viva", "Preservar decisões e justificativas", "Dar contexto melhor à IA", "Reduzir retrabalho", "Evitar dependência de pessoas", "Validar se a entrega está pronta", "Outro"],
  preferredUse: ["Pelo site", "Dentro da IA por MCP", "Pelo CLI no meu computador", "Site, CLI e MCP", "Extensão do editor", "Integração com GitHub ou GitLab", "Quero uma recomendação", "Outro"],
  freeIntent: ["Usaria imediatamente", "Provavelmente usaria", "Talvez, dependendo do resultado", "Usaria apenas para testar", "Provavelmente não usaria", "Não usaria"],
  proDrivers: ["Análise do projeto real", "Integração por MCP", "CLI para iniciar e sincronizar projetos", "Histórico de decisões", "Documentação automática", "Identificação contínua de riscos", "Roadmap sempre atualizado", "Critérios de aceite e evidências", "Integração com GitHub ou GitLab", "Mais projetos e análises", "Relatórios compartilháveis", "Privacidade e controles", "Outro"],
  paymentPreference: ["Assinatura por usuário", "Assinatura por projeto", "Pagamento por análise", "Pacote de créditos", "Plano anual com desconto", "Somente para equipe", "Não pagaria", "Outro"],
  monthlyPrice: ["Até R$ 19", "R$ 20 a R$ 39", "R$ 40 a R$ 69", "R$ 70 a R$ 119", "Acima de R$ 119", "Prefiro pagar por uso", "Não pagaria"],
  primaryConcern: ["Privacidade do código", "Segurança dos dados", "Qualidade das análises", "Custo", "Configuração complexa", "Compatibilidade com minha IA", "Recomendações genéricas", "Outra"],
  trustFactors: ["Mostrar a origem das informações", "Separar fatos, hipóteses e dúvidas", "Nunca alterar código sem autorização", "Permitir revisar decisões", "Apresentar evidências e critérios", "Explicar cada recomendação", "Permitir excluir os dados", "Funcionar sem armazenar o código", "Outro"],
  usefulness: ["Resolveria um problema importante", "Seria útil em alguns projetos", "Interessante, mas ainda não preciso", "Já uso outra solução", "Não entendi claramente o valor", "Não utilizaria"],
  betaInterest: ["Sim", "Talvez", "Não"],
} as const;

export type SurveyField = keyof typeof surveyOptions;

export const surveyLabels: Record<SurveyField, string> = {
  profile: "Perfil", aiUsage: "Uso de IA", decisionDifficulty: "Dificuldade com decisões antigas", problems: "Problemas enfrentados", decisionValue: "Valor do histórico de decisões", benefits: "Benefícios prioritários", preferredUse: "Forma de uso", freeIntent: "Intenção de usar o Free", proDrivers: "Motivos para assinar o Pro", paymentPreference: "Forma de pagamento", monthlyPrice: "Faixa de preço", primaryConcern: "Principal preocupação", trustFactors: "Fatores de confiança", usefulness: "Utilidade percebida", betaInterest: "Interesse na beta",
};

export const multiFields = new Set<SurveyField>(["problems", "benefits", "proDrivers", "trustFactors"]);
