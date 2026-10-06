"use client";
/* Native navigation avoids the vinext RSC prefetch failure on Cloudflare. */
/* eslint-disable @next/next/no-html-link-for-pages */

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Database, FileSearch, History, ShieldCheck, TerminalSquare } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/components/i18n";
import { multiFields, surveyOptions, type SurveyField } from "@/lib/survey";
import { getSurveyLocale, getSurveyOptionLabel } from "@/lib/survey-translations";

export default function SurveyPage() {
  const { locale } = useI18n();
  const { copy: t, questions: questionCopy, followUps } = getSurveyLocale(locale);
  const questions = (Object.keys(surveyOptions) as SurveyField[]).map(field => ({ field, ...questionCopy[field] }));
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [openHelp, setOpenHelp] = useState<SurveyField | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const answered = questions.filter(q => (selected[q.field]?.length ?? 0) > 0).length;

  function select(field: SurveyField, value: string, multiple: boolean) {
    setSelected(current => {
      if (!multiple) return { ...current, [field]: [value] };
      const values = current[field] ?? [];
      if (values.includes(value)) return { ...current, [field]: values.filter(item => item !== value) };
      if (values.length >= 3) return current;
      return { ...current, [field]: [...values, value] };
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = questions.find(question => !(selected[question.field]?.length));
    if (missing) {
      setStatus("error");
      setMessage(t.missing);
      document.getElementById(`question-${missing.field}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const data = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = { consent: data.get("consent") === "on", locale: navigator.language, website: data.get("website") };
    for (const question of questions) payload[question.field] = multiFields.has(question.field) ? selected[question.field] : selected[question.field][0];
    payload.otherDetails = Object.fromEntries(questions.flatMap(question => {
      const hasOther = selected[question.field]?.some(value => value === "Outro" || value === "Outra");
      return hasOther ? [[question.field, data.get(`other_${question.field}`)?.toString().trim() ?? ""]] : [];
    }));
    for (const name of ["aiTools", "decisionExample", "decisionWhy", "freeRequirement", "competitor", "recommendation", "contact"]) payload[name] = data.get(name)?.toString() ?? "";

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/pesquisa", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar.");
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t.error);
    }
  }

  return <div className="portal-page survey-page"><SiteHeader active="pesquisa" />
    <main className="survey-shell">
      {status === "success" ? <section className="survey-success" aria-live="polite"><span><CheckCircle2 /></span><p className="portal-kicker">{t.successTag}</p><h1>{t.successTitle}</h1><p>{t.successText}</p><a className="primary-cta" href="/">{t.back} <ArrowRight size={17}/></a></section> : <>
        <header className="survey-hero">
          <span className="portal-kicker">{t.kicker}</span>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
          <div className="survey-offer">
            <article><span><FileSearch size={19}/> FREE</span><h2>{t.freeTitle}</h2><p>{t.freeText}</p></article>
            <article><span><Database size={19}/> PRO</span><h2>{t.proTitle}</h2><p>{t.proText}</p></article>
            <article><span><TerminalSquare size={19}/> {t.cliTag}</span><h2>{t.cliTitle}</h2><p>{t.cliText}</p></article>
          </div>
          <p className="survey-cli-note">{t.connection}</p>
          <div className="survey-difference"><History size={20}/><p>{t.difference}</p></div>
        </header>

        <form className="survey-form" onSubmit={submit}>
          <div className="survey-progress"><span>{answered} / {questions.length} {t.answered}</span><div><i style={{ width: `${(answered / questions.length) * 100}%` }} /></div></div>
          {questions.map(question => <fieldset className="survey-question" id={`question-${question.field}`} key={question.field}>
            <legend>{question.title}</legend>
            {question.help && <div className={openHelp === question.field ? "survey-help open" : "survey-help"} onMouseEnter={() => setOpenHelp(question.field)} onMouseLeave={() => setOpenHelp(current => current === question.field ? null : current)}>
              <button className="survey-help-trigger" type="button" aria-expanded={openHelp === question.field} aria-controls={`help-${question.field}`} aria-label={`${t.helpLabel} ${question.title.split(".")[0]}`} onClick={() => setOpenHelp(current => current === question.field ? null : question.field)}><span aria-hidden="true">?</span></button>
              <div className="survey-help-popover" id={`help-${question.field}`} role="note">
                <p>{question.help}</p>
              </div>
            </div>}
            {question.hint && <p>{question.hint}</p>}
            <div className="survey-options">{surveyOptions[question.field].map(option => {
              const multiple = multiFields.has(question.field);
              const checked = selected[question.field]?.includes(option) ?? false;
              return <label className={checked ? "selected" : ""} key={option}><input type={multiple ? "checkbox" : "radio"} name={question.field} value={option} checked={checked} onChange={() => select(question.field, option, multiple)} /><span>{getSurveyOptionLabel(locale, question.field, option)}</span></label>;
            })}</div>
            {selected[question.field]?.some(value => value === "Outro" || value === "Outra") && <label className="survey-followup survey-other">{t.otherLabel}<input name={`other_${question.field}`} maxLength={500} placeholder={t.otherPlaceholder} required autoFocus /></label>}
            {followUps[question.field] && <label className="survey-followup">{followUps[question.field]!.label}<textarea name={followUps[question.field]!.name} maxLength={1200} placeholder={followUps[question.field]!.placeholder} /></label>}
          </fieldset>)}

          <fieldset className="survey-question"><legend>{t.question15}</legend><label className="survey-followup"><textarea name="recommendation" maxLength={1200} placeholder={t.recommendationPlaceholder} /></label></fieldset>
          <section className="survey-contact"><h2>{t.betaTitle}</h2><p>{t.betaText}</p><input name="contact" maxLength={240} placeholder={t.contactPlaceholder} /></section>
          <label className="survey-consent"><input type="checkbox" name="consent" required/><span>{t.consent}</span></label>
          <label className="survey-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          {status === "error" && <p className="survey-error" role="alert">{message}</p>}
          <button className="primary-cta survey-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.send}<ArrowRight size={17}/></button>
          <p className="survey-privacy"><ShieldCheck size={15}/> {t.privacy}</p>
        </form>
      </>}
    </main><SiteFooter /></div>;
}
