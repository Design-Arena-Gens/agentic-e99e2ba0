"use client";
import React from "react";
import ResultsTable from "../components/ResultsTable";
import CSVUploader from "../components/CSVUploader";
import type { RowAnalysis } from "../lib/pareto";

export default function Page() {
  const [spreadsheetId, setSpreadsheetId] = React.useState<string>("");
  const [range, setRange] = React.useState<string>("Respuestas!A:Z");
  const [threshold, setThreshold] = React.useState<number>(80);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [analyses, setAnalyses] = React.useState<RowAnalysis[] | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setAnalyses(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId, range, threshold })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Error al analizar");
      }
      setAnalyses(data.analyses);
    } catch (err: any) {
      setError(err?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h1 className="title">Agente de An?lisis Pareto por Fila</h1>
        <p className="subtitle">
          Con?ctate a Google Sheets y obt?n un informe por fila seg?n Pareto en base a preguntas fijas.
        </p>
        <div className="row">
          <div>
            <label className="muted" style={{ display: "block", marginBottom: 6 }}>
              Spreadsheet ID (Google Sheets)
            </label>
            <input
              className="input"
              placeholder="1AbCdEfG1234567890..."
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
            />
          </div>
          <div>
            <label className="muted" style={{ display: "block", marginBottom: 6 }}>
              Rango (p.ej. Respuestas!A:Z)
            </label>
            <input
              className="input"
              placeholder="Respuestas!A:Z"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <div>
            <label className="muted" style={{ display: "block", marginBottom: 6 }}>
              Umbral Pareto (%)
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value || 80))}
            />
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="button" disabled={loading || !spreadsheetId} onClick={submit}>
              {loading ? "Analizando..." : "Analizar Google Sheet"}
            </button>
          </div>
        </div>
        {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}
      </div>

      <CSVUploader
        onAnalyses={(a) => {
          setAnalyses(a);
          setError(null);
        }}
      />

      {analyses && <ResultsTable analyses={analyses} />}
    </div>
  );
}
