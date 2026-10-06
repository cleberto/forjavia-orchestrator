import type { Metadata } from "next";
import { I18nProvider } from "@/components/i18n";
import { NavigationFallback } from "@/components/navigation-fallback";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://forjavia.clebertow.workers.dev"),
  title: "Forjavia — confiança para software desenvolvido com IA",
  description: "Conecte seu projeto, revele riscos e entregue contexto verificável à IA que você já usa por MCP.",
  openGraph: {
    title: "Forjavia — do projeto à evidência",
    description: "Diagnóstico, método e verificação para a IA que você já usa.",
    type: "website",
    locale: "pt_BR",
    siteName: "Forjavia",
  },
  twitter: {
    card: "summary",
    title: "Forjavia — do projeto à evidência",
    description: "Diagnóstico, método e verificação para a IA que você já usa.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" suppressHydrationWarning><body><I18nProvider><NavigationFallback />{children}</I18nProvider></body></html>;
}
