"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Braces, ShieldCheck, Workflow, SlidersHorizontal, Download, Upload, MessageCircleQuestion, Check, FolderSearch, Plus, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { factorCatalog, factorGroups, kindDescriptions } from "@/lib/catalog";
import { compileMethod, exportInstructions, initialConfig, parseProfile, kindLabels, type MethodConfig } from "@/lib/method";
import { useI18n } from "@/components/i18n";
import { Localized, translateDocument } from "@/components/builder-translations";

export default function Home(){
 const {locale}=useI18n();
 const [config,setConfig]=useState<MethodConfig>(initialConfig);
 const [tab,setTab]=useState("context");
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");
 const upload=useRef<HTMLInputElement>(null);
 const latest=useRef(config);
 const method=compileMethod(config);
 function update<K extends keyof MethodConfig>(key:K,value:MethodConfig[K]){setConfig(c=>({...c,[key]:value,...(["kind","factors","customKind","customConcern","hasCustomConcern"].includes(key)?{factorsReviewed:false}:{})}));setMessage("");setError("");}
 function download(kind:"profile"|"instructions"){
  const content=kind==="profile"?JSON.stringify(config,null,2):translateDocument(locale,exportInstructions(config));
  const url=URL.createObjectURL(new Blob([content],{type:kind==="profile"?"application/json;charset=utf-8":"text/markdown;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download=kind==="profile"?"forjavia-profile.json":"FORJAVIA.md";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  setMessage(kind==="profile"?"Configuração preparada para download. Importe o arquivo para retomar ou replicar o método.":"Método preparado para download. Abra FORJAVIA.md com a IA do seu projeto.");
 }
 async function importProfile(file:File|undefined){
  if(!file)return;
  try{if(file.size>65536)throw new Error("O arquivo deve ter até 64 KB.");const next=parseProfile(await file.text());setConfig(next);setTab("context");setError("");setMessage("Perfil importado. Suas respostas foram restauradas.");}
  catch(e){setError(e instanceof Error?e.message:"Não foi possível importar.");}
  finally{if(upload.current)upload.current.value="";}
 }
 useEffect(()=>{
  latest.current=config;
 },[config]);
 useEffect(()=>{
  type Tool={name:string;description:string;inputSchema:object;annotations:object;execute:(input:unknown)=>unknown};
  const context=(document as Document & {modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>void|Promise<void>}}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  const tool:Tool={name:"read_forjavia_method",description:"Ler o método proposto e as dúvidas pendentes do questionário visível. Não analisa repositórios nem executa agentes.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(input){
   if(!input||typeof input!=="object"||Array.isArray(input)||Object.keys(input).length)throw new Error("Use um objeto vazio.");
   return compileMethod(latest.current);
  }};
  try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
  return ()=>lifecycle.abort();
 },[]);
 return <Localized><div className="forjavia-app product-shell">
  <SiteHeader active="builder" />
  <div className="app-mode-strip"><span>DEMONSTRAÇÃO PÚBLICA · SEM CONTA</span><p>Explore a entrevista. Login, GitHub e MCP entram na beta autenticada.</p><a href="/roadmap">Ver roadmap <ArrowRight size={14}/></a></div>
  <main id="builder" className="workspace">
   <div className="workspace-heading"><div><div className="eyebrow"><span className="tiny-line"/> MÉTODO ANTES DO CÓDIGO</div><h1>Seu projeto.<br/>Um caminho claro.</h1><p>Comece uma ideia ou evolua o que já existe.<br className="desktop-break"/> Crie o caminho que a IA do seu projeto vai seguir.</p></div><div className="heading-note"><Workflow size={22}/><span>Seu projeto.<br/><strong>Suas regras. Seu ritmo.</strong></span></div></div>
   <RadioGroup className="journey-picker" value={config.mode} onValueChange={v=>update("mode",v as MethodConfig["mode"])} aria-label="Ponto de partida">
    <label className={config.mode==="existing"?"journey selected":"journey"}><RadioGroupItem value="existing" id="existing"/><FolderSearch size={23}/><span><strong>Meu projeto já existe</strong><small>Entender, encontrar gaps e evoluir.</small></span><ChevronRight size={18}/></label>
    <label className={config.mode==="new"?"journey selected":"journey"}><RadioGroupItem value="new" id="new"/><Plus size={23}/><span><strong>Vou começar do zero</strong><small>Explorar, decidir e construir uma base.</small></span><ChevronRight size={18}/></label>
   </RadioGroup>
   <div className="builder-grid">
    <section className="config-panel" aria-labelledby="config-title"><div className="panel-header"><span className="step-tag">01</span><h2 id="config-title">Desenhe seu contexto</h2><SlidersHorizontal size={19}/></div>
    <div className="builder-tab-shell"><div className="builder-tabs" role="tablist" aria-label="Etapas do construtor">{[["context","Contexto"],["care","Cuidados"],["questions","Dúvidas"],["apply","Aplicar"]].map(([value,label])=><button type="button" role="tab" aria-selected={tab===value} className={tab===value?"active":undefined} onClick={()=>setTab(value)} key={value}>{label}{value==="questions"&&<span className="count">{method.questions.length}</span>}</button>)}</div>
     {tab==="context"&&<section className="panel-content" role="tabpanel">
      <div className="form-field"><label htmlFor="project-name">Como se chama o projeto?</label><Input id="project-name" value={config.name} maxLength={80} onChange={e=>update("name",e.target.value)}/></div>
      <div className="form-field"><label htmlFor="kind">O que você está construindo?</label><Select value={config.kind} onValueChange={v=>update("kind",v as MethodConfig["kind"])}><SelectTrigger id="kind" className="w-full"><SelectValue/></SelectTrigger><SelectContent>{Object.entries(kindLabels).map(([v,label])=><SelectItem value={v} key={v}>{label}</SelectItem>)}</SelectContent></Select><p className="field-hint">{kindDescriptions[config.kind]}</p></div>
      {config.kind==="custom"&&<div className="form-field custom-field"><label htmlFor="custom-kind">Descreva seu cenário</label><Textarea id="custom-kind" value={config.customKind??""} maxLength={700} onChange={e=>update("customKind",e.target.value)} placeholder="Ex.: um simulador para treinamento, um plugin de áudio ou um sistema para uma indústria."/><p className="field-hint">Inclua onde será usado e o que o torna diferente.</p></div>}
      <div className="form-field"><label htmlFor="brief">{config.mode==="existing"?"O que precisa melhorar?":"Qual ideia você quer tirar do papel?"}</label><Textarea id="brief" value={config.brief} maxLength={2000} onChange={e=>update("brief",e.target.value)} placeholder={config.mode==="existing"?"Ex.: cresceu rápido e quero entender a estrutura antes de adicionar novas funcionalidades.":"Ex.: uma plataforma para profissionais organizarem seus atendimentos."} className="brief-input"/></div>
      <div className="form-field"><label htmlFor="audience">Quem vai usar?</label><Input id="audience" value={config.audience} maxLength={500} onChange={e=>update("audience",e.target.value)} placeholder="Público e principal necessidade"/></div>
      <div className="form-field"><label htmlFor="stack">{config.mode==="existing"?"Quais tecnologias já usa?":"Tem alguma tecnologia em mente?"}</label><Input id="stack" value={config.stack} maxLength={300} onChange={e=>update("stack",e.target.value)} placeholder="Ex.: React e Node, ou «quero ajuda para decidir»"/></div>
      {config.mode==="existing"&&<div className="form-field"><label htmlFor="checks">Já existem testes automatizados?</label><Select value={config.checks} onValueChange={v=>update("checks",v as MethodConfig["checks"])}><SelectTrigger id="checks" className="w-full"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="unknown">Ainda não sei</SelectItem><SelectItem value="yes">Sim, precisamos conferir os resultados</SelectItem><SelectItem value="no">Não, precisamos criar uma base</SelectItem></SelectContent></Select></div>}
      {config.mode==="new"&&["web","website","commerce","mobile"].includes(config.kind)&&<fieldset className="design-fields"><legend>Qual direção visual vale explorar?</legend><p className="field-hint">Uma preferência inicial para orientar a IA, não um design aprovado.</p><RadioGroup value={config.design} onValueChange={v=>update("design",v as MethodConfig["design"])} className="design-options">{[["essential","Essencial"],["workspace","Painel"],["editorial","Editorial"]].map(([value,label])=><label className={config.design===value?"design-choice chosen":"design-choice"} key={value}><div className={"layout-sample "+value} aria-hidden="true"><i/><i/><i/></div><span><RadioGroupItem value={value}/>{label}</span></label>)}</RadioGroup></fieldset>}
      <details className="advanced"><summary>Preferências e limites do projeto</summary><label htmlFor="constraints">O que a IA precisa respeitar?</label><Textarea id="constraints" value={config.constraints} maxLength={1000} onChange={e=>update("constraints",e.target.value)} placeholder="Ex.: preservar o sistema atual; priorizar acessibilidade; orçamento limitado."/></details>
      <Button className="next-button" onClick={()=>setTab("care")}>Continuar: cuidados <ArrowRight/></Button>
     </section>}
     {tab==="care"&&<section className="panel-content care-panel" role="tabpanel"><div className="care-heading"><h3>O que merece atenção?</h3><p className="section-copy">Selecione o que faz parte do seu projeto. Cada escolha acrescenta critérios ao método.</p></div>
      <Accordion type="multiple" defaultValue={["people","experience"]} className="care-accordion">{factorGroups.map(group=><AccordionItem key={group.id} value={group.id}><AccordionTrigger><span><strong>{group.label}</strong><small>{group.description}</small></span><span className="group-count">{config.factors.filter(f=>factorCatalog.find(item=>item.id===f)?.group===group.id).length} selecionados</span></AccordionTrigger><AccordionContent><div className="care-options">{factorCatalog.filter(f=>f.group===group.id).map(factor=><label className={config.factors.includes(factor.id)?"care-option selected":"care-option"} key={factor.id}><Checkbox checked={config.factors.includes(factor.id)} onCheckedChange={checked=>update("factors",checked===true?[...config.factors,factor.id]:config.factors.filter(f=>f!==factor.id))}/><span><strong>{factor.label}</strong><small>{factor.description}</small></span></label>)}</div></AccordionContent></AccordionItem>)}</Accordion>
      <div className="other-concern"><label className="check-label"><Checkbox checked={config.hasCustomConcern??false} onCheckedChange={v=>update("hasCustomConcern",v===true)}/>Outro cuidado específico</label>{config.hasCustomConcern&&<div className="form-field"><label htmlFor="custom-concern">O que mais precisamos considerar?</label><Textarea id="custom-concern" value={config.customConcern??""} maxLength={1000} onChange={e=>update("customConcern",e.target.value)} placeholder="Ex.: funcionar sem internet, integrar hardware ou preservar dados de um sistema legado."/></div>}</div>
      <label className="check-label reviewed"><Checkbox id="reviewed" checked={config.factorsReviewed} onCheckedChange={v=>update("factorsReviewed",v===true)}/>Revisei os cuidados, mesmo se nenhum se aplica.</label>
      <div className="form-actions"><Button variant="outline" onClick={()=>setTab("context")}>Voltar</Button><Button onClick={()=>setTab(method.questions.length?"questions":"apply")}>Revisar meu caminho <ArrowRight/></Button></div>
     </section>}
     {tab==="questions"&&<section className="panel-content questions-panel" role="tabpanel"><h3>Clareza antes de avançar.</h3><p className="section-copy">Estas perguntas vêm das respostas que faltam. A análise do projeto poderá revelar outras.</p>{method.questions.length?method.questions.map(q=><article className="question-item" key={q.id}><MessageCircleQuestion size={20}/><div><h4>{q.title}</h4><p>{q.reason}</p><Button variant="link" className="answer-button" onClick={()=>{setTab(["factorsReviewed","customConcern"].includes(q.target)?"care":"context");setTimeout(()=>document.getElementById(({brief:"brief",audience:"audience",stack:"stack",checks:"checks",customKind:"custom-kind",customConcern:"custom-concern",factorsReviewed:"reviewed"} as Record<string,string>)[q.target]??"config-title")?.focus(),100);}}>Responder <ArrowRight size={14}/></Button></div></article>):<div className="complete-note"><Check size={24}/><h4>Contexto inicial preenchido</h4><p>O método pode ser levado à IA. A execução ainda precisa confirmar os fatos e levantar dúvidas do projeto.</p></div>}<Button className="next-button" onClick={()=>setTab("apply")}>{method.questions.length?"Levar as dúvidas para minha IA":"Ver como aplicar"}<ArrowRight/></Button></section>}
     {tab==="apply"&&<section className="panel-content apply-panel" role="tabpanel"><h3>O método vai com você.</h3><p className="section-copy">Use o arquivo na IA que já trabalha com seu projeto. As dúvidas vão junto.</p><ol className="apply-steps"><li><span>1</span><div><strong>Baixe o método</strong><p>Contexto, etapas e critérios reunidos em FORJAVIA.md.</p></div></li><li><span>2</span><div><strong>Abra com sua IA</strong><p>Peça para ler o arquivo e começar pelo reconhecimento, respeitando as permissões do seu projeto.</p></div></li><li><span>3</span><div><strong>Responda e valide o plano</strong><p>Confirme as dúvidas antes de autorizar a implementação.</p></div></li></ol><Button className="next-button" onClick={()=>download("instructions")}><FileText/>Baixar método para minha IA</Button><div className="future-note"><strong>Próxima conexão: GitHub + MCP</strong><p>A conexão de repositório, o diagnóstico automático e o MCP ainda não estão disponíveis nesta demonstração.</p></div><div className="replicate"><h4>Reaplique sem recomeçar</h4><p>Baixe suas respostas e importe-as para retomar ou adaptar o método a outro projeto.</p><Button variant="outline" onClick={()=>download("profile")}><Download/>Exportar configuração</Button></div></section>}
    </div>
    <div className="panel-footer"><Button variant="ghost" onClick={()=>upload.current?.click()}><Upload size={16}/>Importar configuração</Button><input ref={upload} type="file" accept=".json,application/json" className="sr-only" aria-label="Arquivo de configuração Forjavia" onChange={e=>importProfile(e.target.files?.[0])}/><span>Somente nesta sessão</span></div>
    </section>
    <div className="right-column"><section className="method-panel" aria-labelledby="method-title"><div className="method-top"><div className="eyebrow">SEU CAMINHO / MÉTODO V0.2</div><span className="small-badge">Proposta</span></div><p className="project-kind-label">{kindLabels[config.kind]}</p><h2 id="method-title">{config.name||"Seu projeto"}</h2><p className="method-description">{config.mode==="existing"?"Evoluir com contexto. Preservar o que funciona.":"Da descoberta à primeira entrega verificável."}</p><div className="timeline">{method.steps.map((step,i)=><div className="timeline-item" key={step.title}><span className="timeline-number">{String(i+1).padStart(2,"0")}</span><div><h3>{step.title}</h3><p>{step.description}</p><details className="artifact-detail"><summary>Saída esperada</summary><p>{step.artifact}</p></details></div>{i===3?<ShieldCheck size={18}/>:<ArrowRight size={17}/>}</div>)}</div><div className="risk-summary"><span>ATENÇÃO AO RISCO</span><strong>{method.risk}</strong><p>{method.reasons.join(" · ")}</p></div><div className="method-bottom"><MessageCircleQuestion size={18}/><span>{method.questions.length?method.questions.length+" dúvidas iniciais para esclarecer":"Contexto inicial pronto para levar à IA"}</span></div></section><section className="evidence-note"><ShieldCheck size={21}/><div><h3>Diagnóstico exige evidência.</h3><p>Esta prévia organiza seu método. Ainda não acessa o código, encontra gaps reais ou executa sua IA.</p><details><summary>Ver critérios de avanço</summary><ul>{method.gates.map(g=><li key={g}>{g}</li>)}</ul></details></div></section><div className="feedback" role="status" aria-live="polite">{message}</div>{error&&<p className="error-message" role="alert">{error}</p>}</div>
   </div>
   <section id="how" className="how-section"><div><span className="eyebrow">DO CONTEXTO À PRÁTICA</span><h2>Um método.<br/>Muitos caminhos.</h2></div><div className="how-item"><MessageCircleQuestion size={22}/><h3>Entenda primeiro</h3><p>Perguntas claras para reduzir suposições antes de criar ou mudar código.</p></div><div className="how-item"><Braces size={22}/><h3>Aplique onde trabalha</h3><p>Leve contexto e critérios para sua ferramenta de IA.</p></div><div className="how-item"><Workflow size={22}/><h3>Replique e evolua</h3><p>Reutilize a configuração. Ajuste o método quando seu projeto mudar.</p></div></section>
  </main><SiteFooter />
  </div></Localized>;
}
