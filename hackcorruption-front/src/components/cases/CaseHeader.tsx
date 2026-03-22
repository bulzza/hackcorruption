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

       
      </div>
    </section>
  );
}
