"use client";
/* Native navigation avoids the vinext RSC prefetch failure on Cloudflare. */
/* eslint-disable @next/next/no-html-link-for-pages */

import { FormEvent, useState } from "react";
import { BarChart3, Download, KeyRound, RefreshCw } from "lucide-react";
import { surveyLabels, type SurveyField } from "@/lib/survey";

type SurveyResponse = Record<string, unknown> & { id: string; createdAt: string; recommendation: string; contact: string };

function escapeCsv(value: unknown) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function SurveyResultsPage() {
  const [token, setToken] = useState("");
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [status, setStatus] = useState<"locked" | "loading" | "ready" | "error">("locked");
  const [message, setMessage] = useState("");

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/pesquisa", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json() as { responses?: SurveyResponse[]; error?: string };
      if (!response.ok || !result.responses) throw new Error(result.error || "Não foi possível carregar.");
      setResponses(result.responses);
      setStatus("ready");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Acesso não autorizado.");
    }
  }

  function distribution(field: SurveyField) {
    const counts = new Map<string, number>();
    for (const response of responses) {
      const values = Array.isArray(response[field]) ? response[field] as string[] : [String(response[field] ?? "")];
      for (const value of values) if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  function downloadCsv() {
    if (!responses.length) return;
    const columns = Object.keys(responses[0]);
    const csv = [columns.map(escapeCsv).join(","), ...responses.map(row => columns.map(column => escapeCsv(row[column])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `forjavia-pesquisa-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (status !== "ready") return <main className="survey-admin-login"><section><span><KeyRound /></span><p className="portal-kicker">ÁREA PRIVADA</p><h1>Resultados da pesquisa</h1><p>Informe a chave administrativa configurada no Cloudflare.</p><form onSubmit={load}><input type="password" value={token} onChange={event => setToken(event.target.value)} autoComplete="current-password" placeholder="Chave de acesso" required/><button className="primary-cta" disabled={status === "loading"}>{status === "loading" ? "Verificando..." : "Acessar resultados"}</button></form>{status === "error" && <p className="survey-error" role="alert">{message}</p>}<a href="/">Voltar ao portal</a></section></main>;

  const highlights: SurveyField[] = ["freeIntent", "usefulness", "paymentPreference", "monthlyPrice", "preferredUse", "proDrivers", "primaryConcern", "trustFactors"];
  return <main className="survey-results"><header><div><p className="portal-kicker">VALIDAÇÃO DO PRODUTO</p><h1>{responses.length} respostas recebidas</h1><p>Visão consolidada das preferências, objeções e sinais de compra.</p></div><div><button onClick={() => load()}><RefreshCw size={16}/> Atualizar</button><button onClick={downloadCsv}><Download size={16}/> Exportar CSV</button></div></header>
    {!responses.length ? <section className="survey-empty"><BarChart3/><h2>Ainda não há respostas.</h2><p>Compartilhe o endereço da pesquisa e volte aqui depois.</p></section> : <>
      <section className="survey-metrics">{highlights.map(field => {
        const entries = distribution(field);
        const max = entries[0]?.[1] || 1;
        return <article key={field}><h2>{surveyLabels[field]}</h2>{entries.map(([label, count]) => <div className="survey-bar" key={label}><span>{label}<b>{count}</b></span><i><em style={{ width: `${(count / max) * 100}%` }}/></i></div>)}</article>;
      })}</section>
      <section className="survey-comments"><h2>Respostas abertas</h2>{responses.map(response => { const details = response.otherDetails && typeof response.otherDetails === "object" ? response.otherDetails as Record<string, string> : {}; return <article key={response.id}><time>{new Date(response.createdAt).toLocaleString("pt-BR")}</time>{response.recommendation && <blockquote>{response.recommendation}</blockquote>}<p><strong>Perfil:</strong> {String(response.profile)}</p>{Object.entries(details).map(([field, value]) => <p key={field}><strong>{surveyLabels[field as SurveyField] ?? field} — outro:</strong> {value}</p>)}{response.contact && <p><strong>Contato para beta:</strong> {response.contact}</p>}</article>; })}</section>
    </>}
  </main>;
}
