export const kindValues=["web","website","commerce","mobile","online-game","game","api","automation","ai","data","desktop","iot","custom"] as const;
export const kindLabels:Record<string,string>={
  "web": "Aplicação web / SaaS",
  "website": "Site / landing page",
  "commerce": "E-commerce / marketplace",
  "mobile": "Aplicativo mobile",
  "online-game": "Jogo online / multiplayer",
  "game": "Jogo single-player",
  "api": "API / backend",
  "automation": "Automação / bot",
  "ai": "Produto com IA / agentes",
  "data": "Dados / analytics",
  "desktop": "Aplicativo desktop",
  "iot": "IoT / sistemas embarcados",
  "custom": "Outro cenário"
};
export const kindDescriptions:Record<string,string>={
  "web": "Produtos web, portais e ferramentas internas.",
  "website": "Conteúdo, marca, conversão e presença digital.",
  "commerce": "Catálogo, pedidos, pagamentos e vendedores.",
  "mobile": "Experiência para Android, iOS ou ambos.",
  "online-game": "Servidores, sessões, sincronização e economia do jogo.",
  "game": "Gameplay, progressão, assets e desempenho.",
  "api": "Serviços, contratos, integrações e regras de negócio.",
  "automation": "Rotinas, tarefas, eventos e integrações.",
  "ai": "Modelos, conhecimento, avaliações e custos de execução.",
  "data": "Pipelines, qualidade dos dados e visualizações.",
  "desktop": "Instalação, atualização e integração com o sistema.",
  "iot": "Dispositivos, conectividade e comportamento físico.",
  "custom": "Descreva o contexto para o método acompanhar seu projeto."
};
export const factorValues=["personal-data","access","tenants","security","compliance","payments","migration","business-rules","backups","performance","realtime","anticheat","accessibility","devices","external","availability","deployment","ai-quality","assets"] as const;
export const factorCatalog=[
  {
    "id": "personal-data",
    "label": "Dados pessoais",
    "description": "Privacidade, consentimento e retenção.",
    "group": "people",
    "gate": "Revisar autorização, privacidade e isolamento dos dados"
  },
  {
    "id": "access",
    "label": "Login e permissões",
    "description": "Quem pode acessar ou alterar cada recurso.",
    "group": "people",
    "gate": "Testar autenticação, recuperação de acesso e permissões por recurso"
  },
  {
    "id": "tenants",
    "label": "Separação entre clientes",
    "description": "Dados de uma conta não podem vazar para outra.",
    "group": "people",
    "gate": "Comprovar isolamento entre contas e organizações com testes negativos"
  },
  {
    "id": "security",
    "label": "Segurança e abuso",
    "description": "Fraudes, entradas maliciosas e uso indevido.",
    "group": "people",
    "gate": "Modelar ameaças e verificar limites, validação de entrada e proteção contra abuso"
  },
  {
    "id": "compliance",
    "label": "Requisitos regulatórios",
    "description": "Obrigações específicas do setor e do público.",
    "group": "people",
    "gate": "Identificar obrigações aplicáveis e confirmar critérios com responsável qualificado"
  },
  {
    "id": "payments",
    "label": "Pagamentos e assinaturas",
    "description": "Cobranças, reembolsos e eventos repetidos.",
    "group": "business",
    "gate": "Validar pagamentos, repetição de eventos e estados de falha"
  },
  {
    "id": "migration",
    "label": "Migração de dados",
    "description": "Preservar informações durante mudanças.",
    "group": "business",
    "gate": "Validar migração, backup e reversão antes de executar"
  },
  {
    "id": "business-rules",
    "label": "Regras críticas de negócio",
    "description": "Cálculos, estoque, economia e estados válidos.",
    "group": "business",
    "gate": "Comprovar invariantes, cálculos e transições de estado em cenários de fronteira"
  },
  {
    "id": "backups",
    "label": "Backup e recuperação",
    "description": "Retomar o serviço sem perder informação.",
    "group": "business",
    "gate": "Testar restauração e definir limites aceitáveis de perda e indisponibilidade"
  },
  {
    "id": "performance",
    "label": "Performance e escala",
    "description": "Velocidade, recursos e volume de uso.",
    "group": "experience",
    "gate": "Definir budgets de desempenho e medir cenários representativos"
  },
  {
    "id": "realtime",
    "label": "Tempo real / multiplayer",
    "description": "Sincronização, concorrência e latência.",
    "group": "experience",
    "gate": "Testar concorrência, perda de conexão, reconexão e consistência de estado"
  },
  {
    "id": "anticheat",
    "label": "Anti-cheat e autoridade",
    "description": "Impedir que o cliente decida resultados sensíveis.",
    "group": "experience",
    "gate": "Validar ações no servidor e testar manipulação de mensagens e estados"
  },
  {
    "id": "accessibility",
    "label": "Acessibilidade",
    "description": "Teclado, leitura, contraste e tecnologias assistivas.",
    "group": "experience",
    "gate": "Verificar navegação por teclado, semântica, contraste e tecnologias assistivas"
  },
  {
    "id": "devices",
    "label": "Plataformas e dispositivos",
    "description": "Navegadores, celulares, consoles e versões.",
    "group": "experience",
    "gate": "Definir e testar a matriz de dispositivos, resoluções e versões suportadas"
  },
  {
    "id": "external",
    "label": "Serviços externos",
    "description": "APIs, credenciais e dependências remotas.",
    "group": "operation",
    "gate": "Verificar contratos, credenciais e falhas de integrações"
  },
  {
    "id": "availability",
    "label": "Disponibilidade",
    "description": "Falhas, monitoramento e continuidade.",
    "group": "operation",
    "gate": "Definir sinais de saúde, alertas e cenários de indisponibilidade"
  },
  {
    "id": "deployment",
    "label": "Publicação e rollback",
    "description": "Entregar atualizações com recuperação segura.",
    "group": "operation",
    "gate": "Validar publicação gradual, migrações e rollback sem perder trabalho"
  },
  {
    "id": "ai-quality",
    "label": "IA: qualidade e custo",
    "description": "Respostas, avaliações, dados e limites de gasto.",
    "group": "operation",
    "gate": "Avaliar saídas da IA, entradas maliciosas, qualidade e limites de custo"
  },
  {
    "id": "assets",
    "label": "Assets e licenças",
    "description": "Origem de imagens, modelos, áudio e pacotes.",
    "group": "operation",
    "gate": "Registrar origem e condições de uso dos assets e dependências"
  }
] as const;
export const factorGroups=[{id:"people",label:"Pessoas e segurança",description:"Identidade, privacidade e limites de acesso."},{id:"business",label:"Dados e negócio",description:"O que não pode se perder ou sair errado."},{id:"experience",label:"Experiência e escala",description:"Como o produto se comporta em uso real."},{id:"operation",label:"Integrações e operação",description:"Dependências, entrega e continuidade."}] as const;
export const factorLabels:Record<string,string>=Object.fromEntries(factorCatalog.map(f=>[f.id,f.label]));

