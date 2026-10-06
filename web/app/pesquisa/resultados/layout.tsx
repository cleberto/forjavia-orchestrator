import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resultados da pesquisa — Forjavia", robots: { index: false, follow: false } };

export default function SurveyResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
