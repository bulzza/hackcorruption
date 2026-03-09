import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { getJudgeById, toggleJudgeStatus } from "../../services/judgesService";
import type { JudgeDetail } from "../../services/judgesService";

export default function DashboardJudgeDetail() {
  const { id } = useParams<{ id: string }>();
  const [judge, setJudge] = useState<JudgeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setJudge(null);
      setLoading(false);
      return;
    }
    getJudgeById(numericId)
      .then((data) => {
        if (!mounted) return;
        setJudge(data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!judge) return;
    try {
      const updated = await toggleJudgeStatus(judge.id);
      setJudge((prev) => (prev ? { ...prev, ...updated } : prev));
    } catch (err) {
      console.warn(err);
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading judge...</div>;
  }

  if (!judge) {
    return (
      <div className="admin-empty-state">
        <h2>Judge not found</h2>
        <p>The requested judge record could not be found.</p>
        <Link className="admin-btn primary" to="/dashboard/judges">
          Back to Judges
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
        <Link to="/dashboard/judges">Judges</Link>
        <span aria-hidden="true">/</span>
        <span>{judge.full_name}</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{judge.full_name}</h1>
          <p className="admin-page-subtitle">Judge profile and performance overview.</p>
        </div>
        <div className="admin-action-group">
          <Link className="admin-btn ghost" to="/dashboard/judges">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to list
          </Link>
          <Link className="admin-btn secondary" to={`/dashboard/judges/${judge.id}/edit`}>
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
        </div>
      </div>

      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <span>Active cases</span>
          <strong>{judge.metrics.active_cases}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Clearance rate</span>
          <strong>{judge.metrics.clearance_rate_percent}%</strong>
        </div>
        <div className="admin-summary-card">
          <span>Avg duration</span>
          <strong>{judge.metrics.avg_duration_days} days</strong>
        </div>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Judge</h2>
          </div>
          <div className="admin-card-body admin-card-split">
            <div className="admin-detail-list">
              <div>
                <span>Slug</span>
                <strong>{judge.slug}</strong>
              </div>
              <div>
                <span>Full name</span>
                <strong>{judge.full_name}</strong>
              </div>
              <div>
                <span>Year of election</span>
                <strong>{judge.year_of_election}</strong>
              </div>
              <div>
                <span>Area of work</span>
                <strong>{judge.area_of_work}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{judge.status}</strong>
              </div>
            </div>
            <div className="admin-photo-large">
              {judge.photoUrl ? (
                <img src={judge.photoUrl} alt={judge.full_name} />
              ) : (
                <div className="admin-photo-placeholder" />
              )}
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Education</h2>
          </div>
          <div className="admin-card-body">
            {judge.education.length === 0 ? (
              <div className="admin-empty-inline">No education entries recorded.</div>
            ) : (
              <div className="admin-list-grid">
                {judge.education.map((item, index) => (
                  <div className="admin-list-card" key={`edu-${index}`}>
                    <strong>{item.institution || "Unknown institution"}</strong>
                    <span>{item.location || "Location not provided"}</span>
                    <span>{item.year ?? "Year not provided"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Experience</h2>
          </div>
          <div className="admin-card-body">
            {judge.experience.length === 0 ? (
              <div className="admin-empty-inline">No experience entries recorded.</div>
            ) : (
              <div className="admin-list-grid">
                {judge.experience.map((item, index) => (
                  <div className="admin-list-card" key={`exp-${index}`}>
                    <strong>{item.title || "Untitled role"}</strong>
                    <span>{item.position || "Position not specified"}</span>
                    <span>
                      {item.start_year ?? "Start year"} -{" "}
                      {item.is_current ? "Present" : item.end_year ?? "End year"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Metrics</h2>
          </div>
          <div className="admin-card-body admin-metrics-grid">
            <div>
              <span>Avg duration (days)</span>
              <strong>{judge.metrics.avg_duration_days}</strong>
            </div>
            <div>
              <span>Clearance rate (%)</span>
              <strong>{judge.metrics.clearance_rate_percent}</strong>
            </div>
            <div>
              <span>Total solved</span>
              <strong>{judge.metrics.total_solved}</strong>
            </div>
            <div>
              <span>Active cases</span>
              <strong>{judge.metrics.active_cases}</strong>
            </div>
            <div>
              <span>Sentence severity</span>
              <strong>{judge.metrics.sentence_severity}</strong>
            </div>
            <div>
              <span>Appeal reversal (%)</span>
              <strong>{judge.metrics.appeal_reversal_percent}</strong>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Cases</h2>
          </div>
          <div className="admin-card-body">
            {judge.cases.length === 0 ? (
              <div className="admin-empty-inline">No cases assigned to this judge.</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table compact">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Court</th>
                      <th>Type</th>
                      <th>Subtype</th>
                      <th>Basis type</th>
                      <th>Filing date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {judge.cases.map((item, index) => (
                      <tr key={`case-${index}`}>
                        <td className="admin-code">{item.case_id}</td>
                        <td>{item.court}</td>
                        <td>{item.type}</td>
                        <td>{item.subtype}</td>
                        <td>{item.basis_type}</td>
                        <td>{item.filing_date}</td>
                        <td>{item.status}</td>
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
        open={confirmOpen}
        title="Change judge status?"
        message={`This will mark ${judge.full_name} as ${
          judge.status === "Active" ? "Inactive" : "Active"
        }.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
