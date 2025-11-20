import React from "react";
import { analyzeRows, type RowRecord, type RowAnalysis } from "../lib/pareto";

function parseCsv(text: string): RowRecord[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: RowRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(","); // naive split, OK for simple CSV
    const r: RowRecord = {};
    headers.forEach((h, idx) => {
      r[h] = cols[idx] ?? "";
    });
    rows.push(r);
  }
  return rows;
}

type Props = {
  onAnalyses: (analyses: RowAnalysis[]) => void;
};

export default function CSVUploader({ onAnalyses }: Props) {
  const [error, setError] = React.useState<string | null>(null);
  const [threshold, setThreshold] = React.useState<number>(80);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="section-title">Probar con CSV (alternativa sin Google)</div>
      <div className="row">
        <input
          type="file"
          accept=".csv,text/csv"
          className="input"
          onChange={async (e) => {
            setError(null);
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            try {
              const rows = parseCsv(text);
              const analyses = analyzeRows(rows, { thresholdPercentage: threshold });
              onAnalyses(analyses);
            } catch (err: any) {
              setError(err?.message || "No se pudo procesar el CSV");
            }
          }}
        />
        <div>
          <label style={{ display: "block", marginBottom: 6 }} className="muted">
            Umbral Pareto (%)
          </label>
          <input
            className="input"
            type="number"
            value={threshold}
            min={1}
            max={100}
            onChange={(e) => setThreshold(Number(e.target.value || 80))}
          />
        </div>
      </div>
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
    </div>
  );
}
