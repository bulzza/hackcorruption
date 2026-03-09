import { Link, useParams } from "react-router-dom";
import CaseHeader from "../case-detail/CaseHeader";
import KpiGrid from "../case-detail/KpiGrid";
import Timeline from "../case-detail/Timeline";
import RelatedCases from "../case-detail/RelatedCases";
import SimilarCasesCarousel from "../cases/SimilarCasesCarousel";

import { getCaseById, getSimilarCases } from "../../data/cases";

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const item = getCaseById(decodeURIComponent(caseId ?? ""));

  if (!item) {
    return (
      <main className="data-page">
        <div className="container" style={{ paddingTop: "8rem", paddingBottom: "6rem" }}>
          <h1 className="section-title large">Case not found</h1>
          <Link
            to="/data/cases"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            ← Back to Cases
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="data-page">
      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: "1rem" }}>
        <Link
          to="/data/cases"
          style={{ color: "#6b7280", textDecoration: "none", fontSize: "0.9rem" }}
        >
          ← Back to Cases
        </Link>
      </div>

      {/* Case Header */}
      <section className="case-header">
        <div className="container" id="case-header-content">
          <CaseHeader item={item} />
        </div>
      </section>

      {/* Main Content */}
      <div className="container detail-layout">
        {/* Left Column: Summary */}
        <div className="detail-left">
          <h2 className="section-title">Case Summary</h2>
          <div className="case-text" id="case-summary-content">
            {item.summary}
          </div>

          <h2 className="section-title">Case Details</h2>
          <div className="case-details-card">
            <div className="case-details-grid">
              <div className="case-details-item">
                <span className="case-details-label">Case Type</span>
                <span className="case-details-value">{item.caseType}</span>
              </div>
              <div className="case-details-item">
                <span className="case-details-label">Case Subtype</span>
                <span className="case-details-value">{item.legalArea}</span>
              </div>
              <div className="case-details-item">
                <span className="case-details-label">Basis Type</span>
                <span className="case-details-value">{item.tags?.[0] ?? "undefined"}</span>
              </div>
              <div className="case-details-item">
                <span className="case-details-label">Basis</span>
                <span className="case-details-value">
                  {(item.tags ?? []).slice(1).join(", ") || "undefined"}
                </span>
              </div>
              <div className="case-details-item case-details-span">
                <span className="case-details-label">Articles</span>
                <span className="case-details-value">undefined</span>
              </div>
              <div className="case-details-item case-details-span">
                <span className="case-details-label">Public Prosecutor Case</span>
                <span className="case-details-value">undefined</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & KPIs */}
        <div className="detail-right">
          <h2 className="section-title">Key Insights</h2>
          <KpiGrid item={item} />

          <h2 className="section-title">Timeline</h2>
          <div className="timeline" id="case-timeline">
            <Timeline items={item.timeline} />
          </div>
        </div>
      </div>

      {/* Related Cases */}
      <div className="container" id="related-cases-container">
        <RelatedCases currentId={item.id} />
      </div>

      {/* Similar Cases */}
      <div
        className="container"
        id="similar-cases-container"
        style={{ paddingBottom: "4rem", marginTop: "3rem" }}
      >
        <SimilarCasesCarousel items={getSimilarCases(item)} title="Similar Cases" />
      </div>
    </main>
  );
}
