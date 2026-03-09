import type { CaseItem } from "../../data/cases";
import { Link } from "react-router-dom";

export default function RelatedCases({ items }: { items: CaseItem[] }) {
  if (!items.length) return null;

  return (
    <div style={{ marginTop: "3rem" }}>
      <h2 className="section-title">Related Cases</h2>

      <div className="similar-cases-grid">
        {items.map((c) => (
          <Link
            key={c.id}
            to={`/data/cases/${encodeURIComponent(c.id)}`}
            className="similar-case-card"
          >
            <div className="similar-case-title">{c.id}</div>

            <div className="similar-details-grid">
              <div className="similar-field-group">
                <div className="similar-label">Court</div>
                <div className="similar-value">{c.court}</div>
              </div>
              <div className="similar-field-group">
                <div className="similar-label">Judge</div>
                <div className="similar-value">{c.judge}</div>
              </div>
              <div className="similar-field-group">
                <div className="similar-label">Decision</div>
                <div className="similar-value">{c.decisionDate}</div>
              </div>
              <div className="similar-field-group">
                <div className="similar-label">Cost</div>
                <div className="similar-value">€{c.costEUR.toLocaleString()}</div>
              </div>
            </div>

            <div className="similarity-badge">Related</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
