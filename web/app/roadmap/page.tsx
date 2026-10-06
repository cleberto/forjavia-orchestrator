import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const REPO_URL = "https://github.com/cleberto/forjavia-orchestrator";

export const metadata: Metadata = {
  title: "Roadmap — Forjavia (prévia)",
  description: "Fases 0 a 10 da arquitetura Forjavia v1.3 e estado atual do projeto.",
};

const PHASES: { n: number; name: string; state: string }[] = [
  { n: 0, name: "Cutover", state: "Em andamento — bridge local experimental; transporte GitHub/cloud não comprovado; gate de cutover aberto." },
  { n: 1, name: "Baseline independente", state: "Em andamento — baseline público inicial implementado." },
  { n: 2, name: "Existing Project Bootstrap / Legacy Reconciliation", state: "Planejada." },
  { n: 3, name: "Spec Kit", state: "Planejada." },
  { n: 4, name: "TLC", state: "Planejada." },
  { n: 5, name: "Understand Anything", state: "Planejada." },
  { n: 6, name: "Integrated Engineering Graph", state: "Planejada." },
  { n: 7, name: "Forjavia UI — evoluir a UI/dashboard do Understand Anything", state: "Planejada." },
  { n: 8, name: "Benchmarks LIGHT/STANDARD/CRITICAL", state: "Planejada." },
  { n: 9, name: "Simplify / delete duplication", state: "Planejada." },
  { n: 10, name: "Public release", state: "Planejada." },
];

export default function RoadmapPage() {
  return (
    <>
      <SiteHeader active="roadmap" />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">Roadmap</h1>
        <p className="mt-4">
          Fases conforme a arquitetura Forjavia v1.3. Princípio que guia a ordem: a integração converge antes da adoção de nova tecnologia de grande porte. Esta é uma prévia informativa; nenhuma fase além do baseline inicial está concluída.
        </p>
        <ol className="mt-6 space-y-4">
          {PHASES.map((phase) => (
            <li key={phase.n}>
              <h2 className="text-lg font-semibold">
                {phase.n}. {phase.name}
              </h2>
              <p>{phase.state}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          Detalhes em{" "}
          <a href={`${REPO_URL}/blob/main/docs/05-roadmap.md`} rel="noopener noreferrer" className="underline">docs/05-roadmap.md</a>
          {" "}e{" "}
          <a href={`${REPO_URL}/blob/main/docs/architecture-v1.3.md`} rel="noopener noreferrer" className="underline">docs/architecture-v1.3.md</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
