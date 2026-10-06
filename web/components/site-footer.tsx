import Link from "next/link";

const REPO_URL = "https://github.com/cleberto/forjavia-orchestrator";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-4 py-6 text-sm">
        <span>Forjavia — projeto open source (MIT). Prévia informativa.</span>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-4">
          <Link href="/">Home</Link>
          <Link href="/roadmap">Roadmap</Link>
          <a href={`${REPO_URL}#readme`} rel="noopener noreferrer">
            Docs
          </a>
          <a href={REPO_URL} rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default SiteFooter;
