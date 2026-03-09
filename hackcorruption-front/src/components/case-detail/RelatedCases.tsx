import { Link } from "react-router-dom";
import { getCaseById, getRelatedCases } from "../../data/cases";

export default function RelatedCases({ currentId }: { currentId: string }) {
  const current = getCaseById(currentId);
  const related = current ? getRelatedCases(current) : [];

  if (!related.length) return null;

  return (
    <div className="related-cases-section">
      <h2 className="section-title">Related Cases</h2>

      <div className="related-cases-card">
        <table className="related-cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Court</th>
              <th>Judge</th>
              <th>Type</th>
              <th>Basis Type</th>
              <th>Filing Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {related.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/data/cases/${encodeURIComponent(c.id)}`} className="related-case-link">
                    {c.id}
                  </Link>
                </td>
                <td>{c.court}</td>
                <td>{c.judge}</td>
                <td>{c.caseType}</td>
                <td>{c.tags?.[0] ?? "undefined"}</td>
                <td>{c.timeline?.[0]?.date ?? "undefined"}</td>
                <td>
                  <span className="status-badge status-closed">Closed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
