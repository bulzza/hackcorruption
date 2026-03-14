import type { CaseItem } from "../../data/cases";

export default function CaseHeader({ item }: { item: CaseItem }) {
  return (
    <section className="case-header">
      <div className="container">
        <div className="case-title-large">{item.id}</div>

        <div className="case-meta-row">
          <div className="case-meta-item">
            <strong>Court:</strong> {item.court}
          </div>
          <div className="case-meta-item">
            <strong>Judge:</strong> {item.judge}
          </div>
          <div className="case-meta-item">
            <strong>Decision date:</strong> {item.decisionDate}
          </div>
        </div>

        <div className="cost-section">
          <div className="cost-item">
            <span className="cost-label">Case Cost</span>
            <span className="cost-value">€{item.costEUR.toLocaleString()}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Duration</span>
            <span className="cost-value">{item.durationDays} days</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Area</span>
            <span className="cost-value">{item.legalArea}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
