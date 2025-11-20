import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchSheet } from "../../../lib/sheets";
import { analyzeRows } from "../../../lib/pareto";

const BodySchema = z.object({
  spreadsheetId: z.string().min(10),
  range: z.string().min(1).default("Respuestas!A:Z"),
  threshold: z.number().min(1).max(100).optional()
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Par?metros inv?lidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { spreadsheetId, range, threshold } = parsed.data;
    const { headers, rows } = await fetchSheet({ spreadsheetId, range });
    const analyses = analyzeRows(rows, {
      thresholdPercentage: threshold ?? 80
    });
    return NextResponse.json({ headers, analyses });
  } catch (err: any) {
    const message =
      err?.message ||
      "Error desconocido al analizar. Verifique permisos del Sheet y variables de entorno.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
