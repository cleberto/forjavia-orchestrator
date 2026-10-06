import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forjavia — Control Plane aberto (prévia)",
  description:
    "Prévia informativa do Forjavia, projeto open source de Control Plane para engenharia de software assistida por agentes. Não é um produto funcional.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
