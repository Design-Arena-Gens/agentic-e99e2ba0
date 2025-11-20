import React from "react";
import type { RowAnalysis } from "../lib/pareto";

function formatPct(n: number) {
  return `${n.toFixed(1)}%`;
}

type Props = {
  analyses: RowAnalysis[];
};

export function ResultsTable({ analyses }: Props) {
  if (!analyses?.length) return null;
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="section-title">Resultados</div>
      <table className="table">
        <thead>
          <tr>
            <th>Fila</th>
            <th>ID</th>
            <th>Puntaje Total</th>
            <th>Top causas (hasta 80%)</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((a) => {
            const vital = a.items.filter((i) => i.isVital);
            return (
              <tr key={a.index}>
                <td>{a.index}</td>
                <td>{a.id ?? "-"}</td>
                <td>{a.totalScore.toFixed(2)}</td>
                <td>
                  {vital.length === 0 ? (
                    <span className="muted">Sin causas destacadas</span>
                  ) : (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {vital.map((i) => (
                        <span key={i.key} className="tag vital">
                          {i.key}: {i.value.toFixed(2)} ({formatPct(i.percentage)}) ? {formatPct(i.cumulativePercentage)}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
