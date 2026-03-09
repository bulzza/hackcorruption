import type { CaseItem } from "../../data/cases";

export default function CaseHeader({ item }: { item: CaseItem }) {
  return (
    <>
      <div className="case-header-top">
        <div className="case-title-large">{item.id}</div>
        <button className="case-download-btn" type="button">
          Download Case
        </button>
      </div>

      <div className="case-meta-row">
        <div className="case-meta-item">
          <strong>Court:</strong> {item.court}
        </div>
        <div className="case-meta-item">
          <strong>Judge:</strong> {item.judge}
        </div>
        <div className="case-meta-item">
          <strong>Date:</strong> {item.decisionDate}
        </div>
      </div>

      <div className="case-area-pill">{item.legalArea}</div>
    </>
  );
}
