"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/components/i18n";
import { ArrowRight, Braces, CheckCircle2, ChevronRight, FileCheck2, GitBranch, Layers3, MessageSquareMore, Network, Route, ShieldCheck, Sparkles, TerminalSquare } from "lucide-react";

const copy = {
  pt: {
    kicker: "CONFIANÇA PARA SOFTWARE DESENVOLVIDO COM IA",
    heroA: "Sua IA escreve o código.", heroB: "Forjavia preserva o contexto.",
    heroText: "Entenda o que já existe, registre por que cada decisão foi tomada e entregue contexto verificável à IA que você já usa.",
    primary: "Analisar meu projeto grátis", secondary: "Ver relatório de exemplo",
    noCard: "Conta grátis · sem cartão", immediate: "Diagnóstico orientado", portable: "MCP · independente do agente",
    problemIndex: "01 / O PROBLEMA", problemEye: "VELOCIDADE SEM CONTEXTO GERA RETRABALHO",
    problemTitleA: "Mais código não resolve", problemTitleB: "decisões esquecidas.",
    problemP: "Prompts, regras e decisões ficam espalhados. O agente age sem conhecer os limites que sustentam o projeto.",
    problemStrong: "Forjavia reúne esse conhecimento em um caminho verificável e reutilizável.",
    scattered: "Informação dispersa", compiled: "compila o método", aligned: "Caminho explícito",
    outputsIndex: "02 / VALOR IMEDIATO", outputsEye: "ENTRE COM UMA IDEIA. SAIA COM UM ARTEFATO ÚTIL.",
    outputsTitleA: "Valor antes da cobrança.", outputsTitleB: "Evidência antes da confiança.",
    outputsText: "O Free entrega um diagnóstico e um método utilizável antes de qualquer assinatura Pro.",
    outputs: [
      ["Perguntas que faltavam", "Descubra decisões, riscos e lacunas antes que virem retrabalho."],
      ["Método portátil", "Baixe um arquivo estruturado para usar com o agente que você já escolheu."],
      ["Caminho de validação", "Saiba o que verificar e qual evidência pedir antes de considerar a tarefa pronta."],
    ],
    coreIndex: "03 / O DIFERENCIAL", coreEye: "MEMÓRIA VERIFICÁVEL PARA O PROJETO",
    coreTitleA: "A ferramenta pode mudar.", coreTitleB: "O conhecimento permanece.",
    coreText: "O Forjavia conecta requisitos, decisões, riscos e evidências para que pessoas e IAs trabalhem sem reconstruir o contexto a cada tarefa.",
    capabilities: [
      ["Roteador de risco", "A tarefa define o rigor.", "Autenticação, pagamentos ou multiplayer recebem controles diferentes de uma mudança visual.", "Contexto → risco → revisão"],
      ["Método independente", "Escolha seu agente.", "Leve o mesmo contexto e os mesmos critérios para diferentes ferramentas, sem recomeçar do zero.", "Método → agente → entrega"],
      ["Rastreabilidade", "Da intenção à evidência.", "Requisito, cenário, teste e resultado permanecem conectados ao trabalho realizado.", "Requisito → teste → evidência"],
      ["Aprendizado controlado", "Correções viram conhecimento.", "No Pro, correções aprovadas poderão originar regras candidatas e avaliações contra reincidências.", "Correção → regra → avaliação"],
    ],
    journeyIndex: "04 / DA INTENÇÃO À ENTREGA", journeyEye: "DO DIAGNÓSTICO À MEMÓRIA CONTÍNUA",
    journeyTitleA: "Um processo visível.", journeyTitleB: "Decisões sob seu controle.",
    journeyText: "O Forjavia lê o projeto autorizado, separa fatos de hipóteses, transforma incertezas em perguntas e mantém decisões ligadas às evidências da entrega.",
    benefits: ["Menos retrabalho", "Decisões rastreáveis", "Independente do agente"],
    journeyAlt: "Fluxo Forjavia: projeto, fatos, perguntas, decisões, execução e evidências",
    howIndex: "05 / COMO COMEÇAR", howEye: "COMPLEXIDADE REVELADA NA HORA CERTA",
    howTitleA: "Seu projeto já começou?", howTitleB: "Comece pelo que ele revela.",
    howText: "Projetos existentes são o primeiro foco: o Forjavia identifica o que está documentado, aponta o que ainda precisa de confirmação e pergunta apenas o que o código não explica.",
    tryBuilder: "Experimentar no construtor",
    stages: [["01","Entender","Contexto, limites e dúvidas relevantes."],["02","Estruturar","Método, riscos e decisões verificáveis."],["03","Aplicar","Um caminho consumível pela IA do projeto."],["04","Evoluir","Evidências e correções alimentam a próxima versão."]],
    previewTabs: ["01 Contexto","02 Cuidados","03 Dúvidas","04 Aplicar"], interview: "ENTREVISTA GUIADA",
    previewQuestion: "O projeto já existe ou vai começar do zero?", existing: "Já existe", newProject: "Começar do zero", adaptive: "As próximas perguntas mudam conforme sua resposta.",
    previewEye: "COMECE SEM CONFIGURAÇÃO", previewTitle: "Use o que você já sabe.",
    previewText: "O construtor transforma respostas simples em um método aplicável e vincula a evolução à sua conta.",
    openFree: "Criar conta grátis",
    finalEye: "O PRIMEIRO RESULTADO É GRATUITO", finalA: "Dê contexto ao agente.", finalB: "Mantenha o controle do projeto.",
    finalPrimary: "Analisar meu projeto", finalSecondary: "Ver relatório de exemplo",
  },
  en: {
    kicker: "CONFIDENCE FOR SOFTWARE BUILT WITH AI", heroA: "Your AI writes code.", heroB: "Forjavia preserves context.", heroText: "Understand what already exists, record why each decision was made, and give verifiable context to the AI you already use.", primary: "Analyze my project for free", secondary: "View sample report", noCard: "Free account · no card", immediate: "Guided diagnosis", portable: "MCP · agent independent",
    problemIndex: "01 / THE PROBLEM", problemEye: "SPEED WITHOUT CONTEXT CREATES REWORK", problemTitleA: "More code does not fix", problemTitleB: "forgotten decisions.", problemP: "Prompts, rules and decisions become scattered. The agent acts without knowing the limits that hold the project together.", problemStrong: "Forjavia turns that knowledge into a reusable, verifiable path.", scattered: "Scattered information", compiled: "compiles the method", aligned: "Explicit path",
    outputsIndex: "02 / IMMEDIATE VALUE", outputsEye: "BRING AN IDEA. LEAVE WITH A USEFUL ARTIFACT.", outputsTitleA: "Value before billing.", outputsTitleB: "Evidence before trust.", outputsText: "Free delivers a diagnosis and usable method before any Pro subscription.", outputs: [["Missing questions","Reveal decisions, risks and gaps before they become rework."],["Portable method","Download a structured file for the agent you already use."],["Validation path","Know what to verify and what evidence to request before calling work done."]],
    coreIndex: "03 / THE DIFFERENCE", coreEye: "VERIFIABLE MEMORY FOR YOUR PROJECT", coreTitleA: "The tool may change.", coreTitleB: "Your knowledge remains.", coreText: "Forjavia connects requirements, decisions, risks and evidence so people and AI can work without rebuilding context for every task.", capabilities: [["Risk router","The task defines the rigor.","Authentication, payments and multiplayer receive different controls from a visual change.","Context → risk → review"],["Agent independent","Choose your agent.","Carry the same context and criteria across tools without starting over.","Method → agent → delivery"],["Traceability","From intent to evidence.","Requirement, scenario, test and result stay connected to the work.","Requirement → test → evidence"],["Controlled learning","Corrections become knowledge.","In Pro, approved corrections can become candidate rules and regression evaluations.","Correction → rule → evaluation"]],
    journeyIndex: "04 / FROM INTENT TO DELIVERY", journeyEye: "FROM DIAGNOSIS TO CONTINUOUS MEMORY", journeyTitleA: "A visible process.", journeyTitleB: "Decisions under your control.", journeyText: "Forjavia reads the authorized project, separates facts from assumptions, turns uncertainty into questions and keeps decisions linked to delivery evidence.", benefits: ["Less rework","Traceable decisions","Agent independent"], journeyAlt: "Forjavia flow: project, facts, questions, decisions, execution and evidence",
    howIndex: "05 / HOW TO START", howEye: "COMPLEXITY REVEALED AT THE RIGHT TIME", howTitleA: "Already have a project?", howTitleB: "Start with what it reveals.", howText: "Existing projects are the first focus: Forjavia finds what is documented, flags what still needs confirmation and asks only what the code cannot explain.", tryBuilder: "Explore the demo", stages: [["01","Understand","Relevant context, limits and questions."],["02","Structure","Method, risks and verifiable decisions."],["03","Apply","A path your project AI can consume."],["04","Evolve","Evidence and corrections improve the next version."]], previewTabs: ["01 Context","02 Concerns","03 Questions","04 Apply"], interview: "GUIDED INTERVIEW", previewQuestion: "Does the project already exist or are you starting from scratch?", existing: "It exists", newProject: "Start from scratch", adaptive: "The next questions adapt to your answer.", previewEye: "START WITH A FREE ACCOUNT", previewTitle: "Use what you already know.", previewText: "The builder turns simple answers into an applicable method and links future progress to your account.", openFree: "Create free account", finalEye: "THE FIRST RESULT IS FREE", finalA: "Give the agent context.", finalB: "Keep control of the project.", finalPrimary: "Analyze my project", finalSecondary: "View sample report",
  },
  de: {
    kicker: "VERTRAUEN FÜR MIT KI ENTWICKELTE SOFTWARE", heroA: "Ihre KI schreibt Code.", heroB: "Forjavia bewahrt den Kontext.", heroText: "Verstehen Sie den Bestand, halten Sie Entscheidungsgründe fest und geben Sie Ihrer vorhandenen KI überprüfbaren Kontext.", primary: "Projekt kostenlos analysieren", secondary: "Beispielbericht ansehen", noCard: "Kostenloses Konto · keine Karte", immediate: "Geführte Diagnose", portable: "MCP · agentenunabhängig",
    problemIndex: "01 / DAS PROBLEM", problemEye: "GESCHWINDIGKEIT OHNE KONTEXT ERZEUGT NACHSARBEIT", problemTitleA: "Mehr Code ersetzt keine", problemTitleB: "vergessenen Entscheidungen.", problemP: "Prompts, Regeln und Entscheidungen sind verstreut. Der Agent handelt, ohne die Grenzen des Projekts zu kennen.", problemStrong: "Forjavia macht daraus einen wiederverwendbaren, überprüfbaren Weg.", scattered: "Verstreute Informationen", compiled: "kompiliert die Methode", aligned: "Klarer Weg",
    outputsIndex: "02 / SOFORTIGER WERT", outputsEye: "MIT EINER IDEE STARTEN. MIT EINEM NÜTZLICHEN ARTEFAKT GEHEN.", outputsTitleA: "Wert vor der Abrechnung.", outputsTitleB: "Nachweis vor Vertrauen.", outputsText: "Free liefert Diagnose und Methode vor jedem Pro-Abonnement.", outputs: [["Fehlende Fragen","Erkennen Sie Entscheidungen, Risiken und Lücken vor der Nacharbeit."],["Portable Methode","Laden Sie eine strukturierte Datei für Ihren vorhandenen Agenten herunter."],["Validierungsweg","Wissen Sie, was geprüft und belegt werden muss, bevor Arbeit als fertig gilt."]],
    coreIndex: "03 / DER UNTERSCHIED", coreEye: "ÜBERPRÜFBARES GEDÄCHTNIS FÜR IHR PROJEKT", coreTitleA: "Das Werkzeug kann wechseln.", coreTitleB: "Ihr Wissen bleibt.", coreText: "Forjavia verbindet Anforderungen, Entscheidungen, Risiken und Nachweise, damit Menschen und KI den Kontext nicht für jede Aufgabe neu aufbauen müssen.", capabilities: [["Risiko-Router","Die Aufgabe bestimmt die Strenge.","Authentifizierung, Zahlungen und Multiplayer brauchen andere Kontrollen als visuelle Änderungen.","Kontext → Risiko → Prüfung"],["Agentenunabhängig","Wählen Sie Ihren Agenten.","Nutzen Sie denselben Kontext und dieselben Kriterien in verschiedenen Werkzeugen.","Methode → Agent → Lieferung"],["Nachvollziehbarkeit","Von der Absicht zum Nachweis.","Anforderung, Szenario, Test und Ergebnis bleiben mit der Arbeit verbunden.","Anforderung → Test → Nachweis"],["Kontrolliertes Lernen","Korrekturen werden Wissen.","In Pro können bestätigte Korrekturen zu Regeln und Regressionstests werden.","Korrektur → Regel → Bewertung"]],
    journeyIndex: "04 / VON DER ABSICHT ZUR LIEFERUNG", journeyEye: "VON DER DIAGNOSE ZUM FORTLAUFENDEN GEDÄCHTNIS", journeyTitleA: "Ein sichtbarer Prozess.", journeyTitleB: "Entscheidungen unter Ihrer Kontrolle.", journeyText: "Forjavia liest das autorisierte Projekt, trennt Fakten von Annahmen, macht Unsicherheiten zu Fragen und verknüpft Entscheidungen mit Nachweisen.", benefits: ["Weniger Nacharbeit","Nachvollziehbare Entscheidungen","Agentenunabhängig"], journeyAlt: "Forjavia-Ablauf: Projekt, Fakten, Fragen, Entscheidungen, Ausführung und Nachweise",
    howIndex: "05 / SO STARTEN SIE", howEye: "KOMPLEXITÄT ZUM RICHTIGEN ZEITPUNKT", howTitleA: "Ihr Projekt läuft bereits?", howTitleB: "Beginnen Sie mit seinen Erkenntnissen.", howText: "Bestehende Projekte sind der erste Schwerpunkt: Forjavia erkennt dokumentierte Fakten, markiert offene Punkte und fragt nur, was der Code nicht erklärt.", tryBuilder: "Demo erkunden", stages: [["01","Verstehen","Relevanter Kontext, Grenzen und Fragen."],["02","Strukturieren","Methode, Risiken und prüfbare Entscheidungen."],["03","Anwenden","Ein Weg, den Ihre Projekt-KI nutzen kann."],["04","Weiterentwickeln","Nachweise und Korrekturen verbessern die nächste Version."]], previewTabs: ["01 Kontext","02 Risiken","03 Fragen","04 Anwenden"], interview: "GEFÜHRTES INTERVIEW", previewQuestion: "Besteht das Projekt bereits oder beginnt es bei null?", existing: "Besteht bereits", newProject: "Bei null beginnen", adaptive: "Die nächsten Fragen passen sich Ihrer Antwort an.", previewEye: "MIT KOSTENLOSEM KONTO STARTEN", previewTitle: "Nutzen Sie, was Sie wissen.", previewText: "Der Builder macht aus einfachen Antworten eine anwendbare Methode und verknüpft die Entwicklung mit Ihrem Konto.", openFree: "Kostenloses Konto erstellen", finalEye: "DAS ERSTE ERGEBNIS IST KOSTENLOS", finalA: "Geben Sie dem Agenten Kontext.", finalB: "Behalten Sie die Kontrolle.", finalPrimary: "Projekt analysieren", finalSecondary: "Beispielbericht ansehen",
  },
} as const;

const icons = [Route, Layers3, Network, Sparkles];

export default function LandingPage() {
  const { locale } = useI18n();
  const c = copy[locale];
  return <div className="landing">
    <SiteHeader active="produto" />
    <main>
      <section className="landing-hero">
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="hero-kicker"><span />{c.kicker}</span>
          <h1>{c.heroA}<br/><em>{c.heroB}</em></h1>
          <p>{c.heroText}</p>
          <div className="hero-actions"><a href="/builder" className="primary-cta">{c.primary}<ArrowRight size={18}/></a><a href="/exemplo" className="secondary-cta">{c.secondary}<ChevronRight size={17}/></a></div>
          <div className="hero-proof"><span><ShieldCheck size={17}/>{c.noCard}</span><span><GitBranch size={17}/>{c.immediate}</span><span><Braces size={17}/>{c.portable}</span></div>
        </div>
      </section>

      <section className="problem-section" id="produto">
        <div className="section-index">{c.problemIndex}</div>
        <div className="problem-grid"><div><span className="landing-eyebrow">{c.problemEye}</span><h2>{c.problemTitleA}<br/>{c.problemTitleB}</h2></div><div className="problem-copy"><p>{c.problemP}</p><p className="problem-emphasis">{c.problemStrong}</p></div></div>
        <div className="chaos-flow" aria-label={c.problemStrong}><div className="flow-state scattered"><span>Prompt</span><span>Rule</span><span>Context</span><span>Test</span><small>{c.scattered}</small></div><div className="flow-core"><span>F/</span><small>{c.compiled}</small></div><div className="flow-state aligned"><span>Understand</span><span>Plan</span><span>Execute</span><span>Verify</span><small>{c.aligned}</small></div></div>
      </section>

      <section className="outcomes-section">
        <div className="section-index">{c.outputsIndex}</div>
        <div className="outcomes-heading"><div><span className="landing-eyebrow">{c.outputsEye}</span><h2>{c.outputsTitleA}<br/>{c.outputsTitleB}</h2></div><p>{c.outputsText}</p></div>
        <div className="outcomes-grid">{c.outputs.map((item,index)=><article key={item[0]}><span>0{index+1}</span><FileCheck2 size={22}/><h3>{item[0]}</h3><p>{item[1]}</p></article>)}</div>
      </section>

      <section className="capabilities-section">
        <div className="section-index">{c.coreIndex}</div>
        <div className="capabilities-heading"><div><span className="landing-eyebrow">{c.coreEye}</span><h2>{c.coreTitleA}<br/>{c.coreTitleB}</h2></div><p>{c.coreText}</p></div>
        <div className="capability-grid">{c.capabilities.map((item,index)=>{const Icon=icons[index];return <article className="capability-card" key={item[0]}><div className="capability-top"><Icon size={23}/><span>{item[0]}</span></div><h3>{item[1]}</h3><p>{item[2]}</p><code>{item[3]}</code></article>})}</div>
      </section>

      <section className="journey-section" aria-labelledby="journey-title">
        <div className="journey-heading"><div><div className="section-index">{c.journeyIndex}</div><span className="landing-eyebrow">{c.journeyEye}</span><h2 id="journey-title">{c.journeyTitleA}<br/>{c.journeyTitleB}</h2></div><div className="journey-copy"><p>{c.journeyText}</p><div className="journey-benefits">{c.benefits.map(item=><span key={item}>{item}</span>)}</div></div></div>
        <div className="journey-media">
          <div className="journey-steps" role="img" aria-label={c.journeyAlt}>{c.stages.map(([number,title,text])=><div className="journey-step" key={number}><span>{number}</span><strong>{title}</strong><small>{text}</small></div>)}</div>
          <div className="journey-live" aria-hidden="true"><i/><span>CONTEXT</span><i/><span>METHOD</span><i/><span>EVIDENCE</span></div>
        </div>
      </section>

      <section className="method-section">
        <div className="method-intro"><div className="section-index">{c.howIndex}</div><span className="landing-eyebrow">{c.howEye}</span><h2>{c.howTitleA}<br/>{c.howTitleB}</h2><p>{c.howText}</p><a href="/builder" className="text-link">{c.tryBuilder}<ArrowRight size={17}/></a></div>
        <div className="stage-list">{c.stages.map(([number,title,text])=><div className="stage-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><CheckCircle2 size={19}/></div>)}</div>
      </section>

      <section className="builder-preview"><div className="preview-shell"><div className="preview-bar"><i/><i/><i/><span>forjavia / new method</span></div><div className="preview-body"><aside>{c.previewTabs.map((item,index)=><span className={index===0?"active":""} key={item}>{item}</span>)}</aside><div className="preview-conversation"><span className="preview-label-dark">{c.interview}</span><h3>{c.previewQuestion}</h3><div className="preview-options"><span><TerminalSquare size={18}/>{c.existing}</span><span><Sparkles size={18}/>{c.newProject}</span></div><div className="preview-question"><MessageSquareMore size={18}/><span>{c.adaptive}</span></div></div></div></div><div className="preview-copy"><span className="landing-eyebrow">{c.previewEye}</span><h2>{c.previewTitle}</h2><p>{c.previewText}</p><a href="/builder" className="primary-cta light">{c.openFree}<ArrowRight size={18}/></a></div></section>

      <section className="final-cta"><span className="landing-eyebrow">{c.finalEye}</span><h2>{c.finalA}<br/>{c.finalB}</h2><div className="final-actions"><a href="/builder" className="primary-cta">{c.finalPrimary}<ArrowRight size={18}/></a><a href="/exemplo" className="secondary-cta">{c.finalSecondary}<ChevronRight size={17}/></a></div></section>
    </main>
    <SiteFooter />
  </div>;
}
