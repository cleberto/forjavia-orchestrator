"use client";
/* Native navigation avoids the vinext RSC prefetch failure on Cloudflare. */
/* eslint-disable @next/next/no-html-link-for-pages */

import { useI18n } from "@/components/i18n";

export function SiteFooter() {
  const { common } = useI18n();
  return (
    <footer className="site-footer">
      <span>FORJAVIA / FORJA + VIA</span>
      <nav aria-label={common.footerNav}>
        <a href="/">{common.product}</a>
        <a href="/exemplo">{common.example}</a>
        <a href="/roadmap">{common.evolution}</a>
        <a href="/planos">{common.plans}</a>
        <a href="/builder">{common.builderActive}</a>
        <a href="/pesquisa">{common.survey}</a>
        <a href="https://github.com/cleberto/Forjavia/issues/new" target="_blank" rel="noreferrer">Feedback</a>
        <a href="https://github.com/cleberto/Forjavia" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <span>{common.footerLine}</span>
    </footer>
  );
}
