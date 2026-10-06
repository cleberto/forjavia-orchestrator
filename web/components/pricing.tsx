import { Check, ArrowUpRight, Layers3, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
export function Pricing(){
 const plans=[
  {name:"Free",tag:"Disponível nesta prévia",price:"Grátis",description:"Para conhecer o método e dar o primeiro passo.",icon:Layers3,features:["Jornadas para criar ou evoluir","Contexto, cuidados e dúvidas","Método exportável para sua IA","Configuração reutilizável"],planned:false},
  {name:"Pro",tag:"Em planejamento",price:"Preço em definição",description:"Para aplicar e evoluir métodos no dia a dia.",icon:Sparkles,features:["Tudo do Free","Catálogo de métodos especializados","Histórico e versões do projeto","MCP e verificação contínua","Diagnósticos e roadmap com evidências"],planned:true},
  {name:"Equipes",tag:"Em planejamento",price:"Preço em definição",description:"Para compartilhar o método e trabalhar em conjunto.",icon:Users,features:["Tudo do Pro","Métodos compartilhados","Papéis e revisão colaborativa","Padrões por organização","Gestão de projetos da equipe"],planned:true}
 ];
 return <section id="planos" className="pricing-section" aria-labelledby="plans-title">
  <div className="pricing-heading"><div><span className="eyebrow">COMECE COM CLAREZA. CRESÇA COM MÉTODO.</span><h2 id="plans-title">Um caminho para cada momento.</h2></div><p>Experimente o Free.<br/>Conheça a direção dos planos pagos.</p></div>
  <div className="pricing-grid">{plans.map(({icon:Icon,...plan})=><article key={plan.name} className={"pricing-card "+(plan.name==="Pro"?"pro-card":"")}><div className="plan-title"><Icon size={23}/><h3>{plan.name}</h3></div><span className="plan-status">{plan.tag}</span><p className="plan-description">{plan.description}</p><div className={plan.planned?"plan-price pending":"plan-price"}>{plan.price}</div><ul>{plan.features.map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul>{plan.planned?<a className="plan-details-link" href="#comparar-planos">Ver proposta do plano <ArrowUpRight size={16}/></a>:<Button asChild className="plan-free-button"><a href="#builder">Continuar no Free <ArrowUpRight/></a></Button>}</article>)}</div>
  <div className="pricing-disclosure"><strong>Transparência desde o começo.</strong> Pro e Equipes são propostas de produto; contratação e cobrança ainda não estão disponíveis. Preços e limites serão definidos antes do lançamento.</div>
  <details id="comparar-planos" className="plan-comparison"><summary>Comparar o que existe e o que está planejado</summary><Table><TableHeader><TableRow><TableHead>Capacidade</TableHead> <TableHead>Free</TableHead><TableHead>Pro</TableHead><TableHead>Equipes</TableHead></TableRow></TableHeader><TableBody>{[
   ["Questionário e exportação","Disponível","Incluído*","Incluído*"],
   ["Configuração reutilizável","Disponível","Incluído*","Incluído*"],
   ["Histórico na plataforma","—","Planejado","Planejado"],
   ["Diagnóstico conectado ao código","—","Planejado","Planejado"],
   ["Integração por MCP","Limitado","Planejado","Planejado"],
   ["Colaboração e métodos da equipe","—","—","Planejado"]
  ].map(row=><TableRow key={row[0]}>{row.map((cell,i)=><TableCell key={i}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table><p>* Proposta de inclusão no lançamento. O consumo de IA dependerá da integração e da ferramenta utilizada.</p></details>
 </section>
}
