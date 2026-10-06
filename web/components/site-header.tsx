import Link from "next/link";

const REPO_URL = "https://github.com/cleberto/forjavia-orchestrator";

// Valores legados aceitos até que as rotas antigas sejam removidas na próxima wave.
export type SiteHeaderActive =
  | "home"
  | "roadmap"
  | "builder"
  | "entrar"
  | "exemplo"
  | "planos"
  | "pesquisa"
  | (string & {});

export type SiteHeaderProps = {
  active?: SiteHeaderActive;
  [key: string]: unknown;
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="border-b">
      <nav aria-label="Navegação principal" className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="font-semibold">
          Forjavia
        </Link>
        <Link href="/" aria-current={active === "home" ? "page" : undefined}>
          Home
        </Link>
        <Link href="/roadmap" aria-current={active === "roadmap" ? "page" : undefined}>
          Roadmap
        </Link>
        <a href={`${REPO_URL}#readme`} rel="noopener noreferrer">
          Docs
        </a>
        <a href={REPO_URL} rel="noopener noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}

export default SiteHeader;
