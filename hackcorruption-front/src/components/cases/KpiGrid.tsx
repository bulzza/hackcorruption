import type { CaseKpis } from "../../data/cases";

function kpiClassForComplexity(c: CaseKpis["complexity"]) {
  if (c === "High") return "warn";
  if (c === "Medium") return "warn";
  return "good";
}

function successClass(prob: number) {
  if (prob >= 75) return "good";
  if (prob >= 50) return "warn";
  return "bad";
}

export default function KpiGrid({ kpis }: { kpis: CaseKpis }) {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className={`kpi-value ${kpiClassForComplexity(kpis.complexity)}`}>
          {kpis.complexity}
        </span>
        <span className="kpi-label">Complexity</span>
      </div>

      <div className="kpi-card">
        <span className={`kpi-value ${successClass(kpis.successProb)}`}>
          {kpis.successProb}%
        </span>
        <span className="kpi-label">Success Prob.</span>
      </div>

      <div className="kpi-card">
        <span className="kpi-value">{/* placeholder */}—</span>
        <span className="kpi-label">Risk Flags</span>
      </div>
    </div>
  );
}
