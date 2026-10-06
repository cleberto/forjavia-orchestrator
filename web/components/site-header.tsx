"use client";
/* Native navigation avoids the vinext RSC prefetch failure on Cloudflare. */
/* eslint-disable @next/next/no-html-link-for-pages */

import { ArrowRight } from "lucide-react";
import { LanguageSwitcher, useI18n } from "@/components/i18n";

type Section = "produto" | "builder" | "roadmap" | "planos" | "exemplo" | "entrar" | "pesquisa";

export function SiteHeader({ active }: { active?: Section }) {
  const { common } = useI18n();
  const links: Array<{ href: string; label: string; id: Section }> = [
    { href: "/#produto", label: common.product, id: "produto" },
    { href: "/exemplo", label: common.example, id: "exemplo" },
    { href: "/planos", label: common.plans, id: "planos" },
  ];

  return (
    <header className="site-header">
      <a href="/" className="site-brand" aria-label={common.home}>
        <span className="site-mark" aria-hidden="true"><strong>F</strong><i>/</i><b /></span>
        <span>forjavia<i>.</i></span>
      </a>
      <nav aria-label={common.navigation}>
        {links.map((link) => (
          <a key={link.id} href={link.href} aria-current={active === link.id ? "page" : undefined}>{link.label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        <a href="/entrar" className={active === "entrar" ? "header-login active" : "header-login"}>{common.login}</a>
        <a href="/builder" className="site-header-cta">
          <span>{common.builder}</span><ArrowRight size={16} />
        </a>
      </div>
    </header>
  );
}
