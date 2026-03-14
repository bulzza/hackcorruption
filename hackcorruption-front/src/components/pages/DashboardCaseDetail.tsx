import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { deleteCase, getCaseById } from "../../services/casesService";
import type { CaseDetail } from "../../services/casesService";

const formatNumber = (value: number | null | undefined, suffix?: string) => {
  if (value === null || value === undefined) return "N/A";
  return suffix ? `${value} ${suffix}` : String(value);
};

export default function DashboardCaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setCaseItem(null);
      setLoading(false);
      return;
    }
    getCaseById(id)
      .then((data) => {
        if (!mounted) return;
        setCaseItem(data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!caseItem || !caseItem.can_delete) return;
    try {
      await deleteCase(caseItem.record_key);
      navigate("/dashboard/cases");
    } catch (err) {
      console.warn(err);
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading case...</div>;
  }

  if (!caseItem) {
    return (
      <div className="admin-empty-state">
        <h2>Case not found</h2>
        <p>The requested case record could not be found.</p>
        <Link className="admin-btn primary" to="/dashboard/cases">
          Back to Cases
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard/cases">Cases</Link>
        <span aria-hidden="true">/</span>
        <span>{caseItem.id}</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{caseItem.id}</h1>
          <p className="admin-page-subtitle">Case details, financials, and timeline.</p>
        </div>
        <div className="admin-action-group">
          <Link className="admin-btn ghost" to="/dashboard/cases">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to list
          </Link>
          {caseItem.court_slug && (
            <Link className="admin-btn ghost" to={`/dashboard/courts/${caseItem.court_slug}`}>
              Court
            </Link>
          )}
          {caseItem.can_edit && (
            <Link className="admin-btn secondary" to={`/dashboard/cases/${encodeURIComponent(caseItem.record_key)}/edit`}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path
                  d="M4 20H8L19 9C20.105 7.895 20.105 6.105 19 5C17.895 3.895 16.105 3.895 15 5L4 16V20Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M13 7L17 11" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              Edit
            </Link>
          )}
          {caseItem.can_delete && (
            <button className="admin-btn danger" type="button" onClick={() => setConfirmOpen(true)}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                <path
                  d="M6 6C8.5 4 15.5 4 18 6C21 8.5 21 15.5 18 18C15.5 20 8.5 20 6 18C3 15.5 3 8.5 6 6Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path d="M12 7V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <span>Source</span>
          <strong>{caseItem.source === "court_file" ? "Court file" : "Registry"}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Status</span>
          <strong>{caseItem.case_status ?? "N/A"}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Case cost</span>
          <strong>{formatNumber(caseItem.case_financials.case_cost, "EUR")}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Duration</span>
          <strong>{formatNumber(caseItem.case_insights.duration_days, "days")}</strong>
        </div>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Case</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-detail-list">
              <div>
                <span>Case ID</span>
                <strong>{caseItem.id}</strong>
              </div>
              <div>
                <span>Court</span>
                <strong>{caseItem.court}</strong>
              </div>
              <div>
                <span>Judge</span>
                <strong>{caseItem.judge ?? "N/A"}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{caseItem.decision_date ?? "N/A"}</strong>
              </div>
              <div>
                <span>Legal area</span>
                <strong>{caseItem.legal_area ?? "N/A"}</strong>
              </div>
              <div>
                <span>Case status</span>
                <strong>{caseItem.case_status ?? "N/A"}</strong>
              </div>
              <div className="admin-case-summary-block">
                <span>Summary</span>
                <strong>{caseItem.summary ?? "N/A"}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Case detail</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-detail-list">
              <div>
                <span>Case type</span>
                <strong>{caseItem.case_detail.case_type ?? "N/A"}</strong>
              </div>
              <div>
                <span>Case subtype</span>
                <strong>{caseItem.case_detail.case_subtype ?? "N/A"}</strong>
              </div>
              <div>
                <span>Basis type</span>
                <strong>{caseItem.case_detail.basis_type ?? "N/A"}</strong>
              </div>
              <div>
                <span>Basis</span>
                <strong>{caseItem.case_detail.basis ?? "N/A"}</strong>
              </div>
              <div>
                <span>Articles</span>
                <strong>{caseItem.case_detail.articles ?? "N/A"}</strong>
              </div>
              <div>
                <span>Public prosecutor case</span>
                <strong>{caseItem.case_detail.public_prosecutor_case ?? "N/A"}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Financials</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-detail-list">
              <div>
                <span>Case cost</span>
                <strong>{formatNumber(caseItem.case_financials.case_cost, "EUR")}</strong>
              </div>
              <div>
                <span>Total case cost</span>
                <strong>{formatNumber(caseItem.case_financials.total_case_cost, "EUR")}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Insights</h2>
          </div>
          <div className="admin-card-body admin-metrics-grid">
            <div>
              <span>Mitigating factors</span>
              <strong>{caseItem.case_insights.mitigating_factors ?? "N/A"}</strong>
            </div>
            <div>
              <span>Plea deal</span>
              <strong>{caseItem.case_insights.plea_deal ?? "N/A"}</strong>
            </div>
            <div>
              <span>Duration (days)</span>
              <strong>{formatNumber(caseItem.case_insights.duration_days)}</strong>
            </div>
            <div>
              <span>Severity ratio</span>
              <strong>{formatNumber(caseItem.case_insights.severity_ratio)}</strong>
            </div>
            <div>
              <span>Sentence severity</span>
              <strong>{caseItem.case_insights.sentence_severity ?? "N/A"}</strong>
            </div>
            <div>
              <span>Appeal</span>
              <strong>{caseItem.case_insights.appeal ?? "N/A"}</strong>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Timeline</h2>
          </div>
          <div className="admin-card-body">
            {caseItem.case_timeline.length === 0 ? (
              <div className="admin-empty-inline">No timeline events recorded.</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table compact">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseItem.case_timeline.map((event, index) => (
                      <tr key={`timeline-${index}`}>
                        <td>{event.event_name}</td>
                        <td>{event.event_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen && caseItem.can_delete}
        title="Delete case?"
        message={`This will permanently remove ${caseItem.id} and its details.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
