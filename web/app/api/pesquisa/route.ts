import { env } from "cloudflare:workers";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { surveyResponses } from "@/db/schema";
import { multiFields, surveyOptions, type SurveyField } from "@/lib/survey";

const textFields = ["aiTools", "decisionExample", "decisionWhy", "freeRequirement", "competitor", "recommendation", "contact"] as const;

function cleanText(value: unknown, limit = 1200) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function validChoice(field: SurveyField, value: unknown) {
  return typeof value === "string" && (surveyOptions[field] as readonly string[]).includes(value);
}

function authorized(request: Request) {
  const expected = env.SURVEY_ADMIN_TOKEN;
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(expected && received && received === expected);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return Response.json({ ok: true }, { status: 201 });
    if (body.consent !== true) return Response.json({ error: "Confirme o consentimento para enviar." }, { status: 400 });

    const values: Record<string, unknown> = {};
    const suppliedOtherDetails = body.otherDetails && typeof body.otherDetails === "object" ? body.otherDetails as Record<string, unknown> : {};
    const otherDetails: Record<string, string> = {};
    for (const field of Object.keys(surveyOptions) as SurveyField[]) {
      if (multiFields.has(field)) {
        const entries = Array.isArray(body[field]) ? body[field].filter(value => validChoice(field, value)).slice(0, 3) : [];
        if (!entries.length) return Response.json({ error: `Responda: ${field}.` }, { status: 400 });
        values[field] = entries;
      } else {
        if (!validChoice(field, body[field])) return Response.json({ error: `Responda: ${field}.` }, { status: 400 });
        values[field] = body[field];
      }
      const chosen = Array.isArray(values[field]) ? values[field] as string[] : [String(values[field])];
      if (chosen.some(value => value === "Outro" || value === "Outra")) {
        const detail = cleanText(suppliedOtherDetails[field], 500);
        if (!detail) return Response.json({ error: `Descreva a opção “Outro” em ${field}.` }, { status: 400 });
        otherDetails[field] = detail;
      }
    }

    const optional = Object.fromEntries(textFields.map(field => [field, cleanText(body[field], field === "contact" ? 240 : 1200)]));
    await getDb().insert(surveyResponses).values({
      id: crypto.randomUUID(),
      ...(values as Omit<typeof surveyResponses.$inferInsert, "id" | "createdAt" | "consent" | "locale">),
      ...optional,
      otherDetails,
      locale: cleanText(body.locale, 20) || "pt-BR",
      consent: true,
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("survey submission failed", error);
    return Response.json({ error: "Não foi possível salvar agora. Tente novamente." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });
  const rows = await getDb().select().from(surveyResponses).orderBy(desc(surveyResponses.createdAt)).limit(1000);
  return Response.json({ responses: rows });
}
