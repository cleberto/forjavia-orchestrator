import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const REPO_URL = "https://github.com/cleberto/forjavia-orchestrator";

const STATUS: { item: string; state: string; note: string }[] = [
  { item: "Arquitetura v1.3", state: "DOCUMENTED / NORMATIVE", note: "Norma vigente; não descreve funcionalidade implementada." },
  { item: "Baseline público independente", state: "IMPLEMENTED (inicial)", note: "Repositório público com licença MIT, notices e verificações de baseline." },
  { item: "Bridge/runner governado local", state: "EXPERIMENTAL (local)", note: "Não é produto pronto." },
  { item: "Transporte do bridge via GitHub/cloud", state: "EXPERIMENTAL", note: "Não comprovado; o gate de cutover continua aberto." },
  { item: "Context Compiler", state: "NORMATIVE / PLANNED", note: "Fronteira conceitual; implementação completa planejada." },
  { item: "Lesson Distiller, Parallel Scheduler", state: "PLANNED", note: "Capacidades condicionais." },
  { item: "Existing Project Bootstrap / Legacy Reconciliation", state: "PLANNED", note: "" },
  { item: "Integração profunda com Spec Kit, TLC e Understand Anything", state: "PLANNED", note: "" },
  { item: "Integrated Engineering Graph", state: "PLANNED", note: "" },
  { item: "Forjavia UI", state: "PLANNED", note: "Ainda não existe." },
  { item: "Release pública do produto completo", state: "PLANNED", note: "" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <section aria-labelledby="intro">
          <h1 id="intro" className="text-3xl font-bold">Forjavia</h1>
          <p className="mt-2 text-lg">Control Plane aberto para engenharia de software assistida por agentes.</p>
          <p className="mt-4">
            <strong>Prévia informativa.</strong> Esta página descreve um projeto open source em fase inicial de baseline. Não é um produto funcional, não exige conta e não oferece serviço hospedado. A maior parte do conteúdo abaixo descreve a arquitetura documentada (v1.3), não funcionalidade implementada.
          </p>
          <p className="mt-4">
            <a href={REPO_URL} rel="noopener noreferrer" className="underline">Repositório no GitHub</a>
            {" · "}
            <Link href="/roadmap" className="underline">Roadmap</Link>
          </p>
        </section>

        <section aria-labelledby="planes" className="mt-10">
          <h2 id="planes" className="text-2xl font-semibold">Três planos</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <strong>Control Plane — Forjavia:</strong> único Control Plane. Estado, governança, autoridade, permissões, roteamento por risco, Context Compiler, evidência e proveniência.
            </li>
            <li>
              <strong>Provider Plane:</strong> Spec Kit (ciclo Spec-Driven Development), TLC Spec-Driven (mecânicas de qualidade e verificação) e Understand Anything (inteligência de código). Providers não governam o sistema.
            </li>
            <li>
              <strong>Execution Plane:</strong> Claude Code, Codex, outros agentes, scripts, testes e CI. Executores são substituíveis; qualquer agente que respeite o contrato de resultado estruturado pode ser trocado.
            </li>
          </ul>
        </section>

        <section aria-labelledby="state" className="mt-10">
          <h2 id="state" className="text-2xl font-semibold">Structured State como source of truth</h2>
          <p className="mt-4">
            O estado canônico de um projeto é o Structured State versionado no repositório. Prompts, arquivos de contexto de agentes e a futura UI são projeções desse estado. Fontes legadas servem apenas como entrada durante o bootstrap de um projeto existente.
          </p>
        </section>

        <section aria-labelledby="future" className="mt-10">
          <h2 id="future" className="text-2xl font-semibold">O que ainda é futuro</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li><strong>Integrated Engineering Graph</strong> (Requirement ↔ Task ↔ Code ↔ Dependency ↔ Test ↔ Evidence ↔ Commit): planejado.</li>
            <li><strong>Forjavia UI</strong>, evoluída a partir do dashboard do Understand Anything: planejada; ainda não existe.</li>
            <li><strong>Integrações profundas</strong> com Spec Kit, TLC e Understand Anything: planejadas.</li>
            <li><strong>Bridge governado local</strong>: experimental; transporte via GitHub/cloud não comprovado.</li>
          </ul>
        </section>

        <section aria-labelledby="status" className="mt-10">
          <h2 id="status" className="text-2xl font-semibold">Estado do projeto</h2>
          <table className="mt-4 w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className="border-b py-2 pr-4">Item</th>
                <th scope="col" className="border-b py-2 pr-4">Estado</th>
                <th scope="col" className="border-b py-2">Observação</th>
              </tr>
            </thead>
            <tbody>
              {STATUS.map((row) => (
                <tr key={row.item}>
                  <td className="border-b py-2 pr-4">{row.item}</td>
                  <td className="border-b py-2 pr-4 font-mono">{row.state}</td>
                  <td className="border-b py-2">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4">Hoje o Forjavia não é um produto instalável de ponta a ponta.</p>
        </section>

        <section aria-labelledby="contribute" className="mt-10">
          <h2 id="contribute" className="text-2xl font-semibold">Contribuindo</h2>
          <p className="mt-4">
            O projeto é aberto, sob licença MIT, sem versão paga nem open-core comercial. Contribuições são voluntárias; veja o{" "}
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} rel="noopener noreferrer" className="underline">CONTRIBUTING.md</a>
            {" "}e a{" "}
            <a href={`${REPO_URL}/blob/main/docs/architecture-v1.3.md`} rel="noopener noreferrer" className="underline">arquitetura v1.3</a>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
