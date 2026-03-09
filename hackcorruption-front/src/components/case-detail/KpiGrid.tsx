import { CASES } from "../../data/cases";
import type { CaseItem } from "../../data/cases";

type Props = {
  item: CaseItem;
};

function complexityClass(v: CaseItem["kpis"]["complexity"]) {
  if (v === "High") return "bad";
  if (v === "Medium") return "warn";
  return "good";
}

function probClass(p: number) {
  if (p >= 75) return "good";
  if (p >= 50) return "warn";
  return "bad";
}

function formatEUR(value: number) {
  return `\u20AC${value.toLocaleString()}`;
}

function totalCostForArea(area: string) {
  return CASES.filter((c) => c.legalArea === area).reduce(
    (sum, c) => sum + c.costEUR,
    0
  );
}

export default function KpiGrid({ item }: Props) {
  const totalCost = totalCostForArea(item.legalArea);
  const severityRatio = (item.kpis.successProb / 100).toFixed(2);
  const hasPleaDeal = (item.tags ?? []).includes("Plea Deal");
  const hasAppeal =
    item.caseType.toLowerCase().includes("appeal") ||
    item.legalArea.toLowerCase().includes("appeal");

  return (
    <div className="insights-panel">
      <div className="insights-cost-row">
        <div className="insights-cost insights-cost-right">
          <span className="insights-cost-label">Case Cost</span>
          <span className="insights-cost-value">{formatEUR(item.costEUR)}</span>
        </div>
        <div className="insights-cost">
          <span className="insights-cost-label">Total Case Cost</span>
          <span className="insights-cost-value">{formatEUR(totalCost)}</span>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <span className="insight-value">None</span>
          <span className="insight-label-row">
            <span className="insight-label">Mitigating Factors</span>
            <span className="kpi-info-icon">
              ?
              <span className="kpi-tooltip">No mitigating factors recorded.</span>
            </span>
          </span>
        </div>

        <div className="insight-card">
          <span className={`insight-value ${hasPleaDeal ? "good" : ""}`}>
            {hasPleaDeal ? "Accepted" : "None"}
          </span>
          <span className="insight-label-row">
            <span className="insight-label">Plea Deal</span>
            <span className="kpi-info-icon">
              ?
              <span className="kpi-tooltip">Indicates whether a plea deal was accepted.</span>
            </span>
          </span>
        </div>

        <div className="insight-card">
          <span className="insight-value">{item.durationDays}</span>
          <span className="insight-unit">days</span>
          <span className="insight-label-row">
            <span className="insight-label">Duration</span>
            <span className="kpi-info-icon">
              ?
              <span className="kpi-tooltip">Elapsed time from filing to decision.</span>
            </span>
          </span>
        </div>

        <div className="insight-card">
          <span className={`insight-value ${probClass(item.kpis.successProb)}`}>
            {severityRatio}
          </span>
          <span className="insight-label-row">
            <span className="insight-label">Severity Ratio</span>
            <span className="kpi-info-icon">
              ?
              <span className="kpi-tooltip">Relative severity based on outcome probability.</span>
            </span>
          </span>
        </div>

        <div className="insight-card">
          <span className={`insight-value ${complexityClass(item.kpis.complexity)}`}>
            {item.kpis.complexity}
          </span>
          <span className="insight-label-row">
            <span className="insight-label">Sentence Severity</span>
            <span className="kpi-info-icon">
              ?
              <span className="kpi-tooltip">Estimated severity from case complexity.</span>
            </span>
          </span>
        </div>

        <div className="insight-card">
          <span className={`insight-value ${hasAppeal ? "warn" : ""}`}>
            {hasAppeal ? "Filed" : "None"}
          </span>
          <span className="insight-label-row">
            <span className="insight-label">Appeal</span>
            <span className="kpi-info-icon">
              ?
              <span className="kpi-tooltip">Appeal status for this case.</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
