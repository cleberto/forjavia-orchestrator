"use client";

import { useState } from "react";
import { ArrowRight, Code2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/components/i18n";

const copy = {
  pt: { kicker:"ACESSO À FORJAVIA", title:"Uma conta. Seus projetos, métodos e evidências.", intro:"Na beta, todo uso da Forjavia será vinculado a uma conta. Assim você poderá retomar decisões, controlar conexões e acompanhar a evolução de cada projeto.", google:"Continuar com Google", github:"Continuar com GitHub", facebook:"Continuar com Facebook", email:"Receber link por e-mail", soon:"Autenticação em preparação", providerNote:"Este acesso será ativado na beta. A demonstração já está disponível para você testar agora.", note:"Google também cobre contas Gmail. A conexão com repositórios será solicitada separadamente, somente quando você escolher um projeto.", demo:"Explorar a demonstração", demoNote:"A demonstração pública não cria conta, não conecta repositórios e não analisa código real.", security:["Login social com permissões mínimas","Sessões revogáveis e protegidas","Exclusão e exportação de dados"] },
  en: { kicker:"ACCESS FORJAVIA", title:"One account. Your projects, methods and evidence.", intro:"During beta, all Forjavia usage will be linked to an account so you can resume decisions, control connections and follow each project's evolution.", google:"Continue with Google", github:"Continue with GitHub", facebook:"Continue with Facebook", email:"Receive an email link", soon:"Authentication in preparation", providerNote:"This access will be enabled during beta. The public demo is ready to try now.", note:"Google also covers Gmail accounts. Repository access will be requested separately, only when you choose a project.", demo:"Explore the demo", demoNote:"The public demo does not create an account, connect repositories or inspect real code.", security:["Minimum-permission social login","Protected, revocable sessions","Data export and deletion"] },
  de: { kicker:"ZUGANG ZU FORJAVIA", title:"Ein Konto. Ihre Projekte, Methoden und Nachweise.", intro:"In der Beta ist jede Nutzung mit einem Konto verbunden. So können Sie Entscheidungen fortsetzen, Verbindungen steuern und die Entwicklung jedes Projekts verfolgen.", google:"Mit Google fortfahren", github:"Mit GitHub fortfahren", facebook:"Mit Facebook fortfahren", email:"Anmeldelink per E-Mail", soon:"Authentifizierung in Vorbereitung", providerNote:"Dieser Zugang wird in der Beta aktiviert. Die öffentliche Demo kann bereits getestet werden.", note:"Google umfasst auch Gmail-Konten. Der Repository-Zugriff wird separat und erst bei der Projektauswahl angefordert.", demo:"Demo erkunden", demoNote:"Die öffentliche Demo erstellt kein Konto, verbindet keine Repositories und analysiert keinen echten Code.", security:["Social Login mit minimalen Rechten","Geschützte, widerrufbare Sitzungen","Datenexport und Löschung"] },
} as const;

export default function SignInPage(){
  const { locale } = useI18n(); const c = copy[locale];
  const [notice, setNotice] = useState("");
  return <div className="portal-page auth-page"><SiteHeader active="entrar"/><main className="auth-layout">
    <section className="auth-copy"><span className="portal-kicker"><LockKeyhole size={16}/>{c.kicker}</span><h1>{c.title}</h1><p>{c.intro}</p><div className="auth-security">{c.security.map(item=><span key={item}><ShieldCheck size={16}/>{item}</span>)}</div></section>
    <section className="auth-card" aria-labelledby="auth-status"><span className="auth-status" id="auth-status">{c.soon}</span>
      <button type="button" data-coming-soon onClick={()=>setNotice(c.providerNote)}><span className="provider-mark google">G</span>{c.google}</button>
      <button type="button" data-coming-soon onClick={()=>setNotice(c.providerNote)}><Code2 size={19}/>{c.github}</button>
      <button type="button" data-coming-soon onClick={()=>setNotice(c.providerNote)}><span className="provider-mark facebook">f</span>{c.facebook}</button>
      <div className="auth-divider"><span>ou</span></div>
      <button type="button" data-coming-soon onClick={()=>setNotice(c.providerNote)}><Mail size={19}/>{c.email}</button>
      {notice&&<p className="auth-feedback" role="status">{notice}</p>}
      <p className="auth-note">{c.note}</p>
      <a href="/builder" className="primary-cta auth-demo">{c.demo}<ArrowRight size={17}/></a>
      <small>{c.demoNote}</small>
    </section>
  </main><SiteFooter/></div>
}
