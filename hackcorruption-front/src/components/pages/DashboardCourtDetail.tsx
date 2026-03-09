import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { getCourtById, toggleCourtStatus } from "../../services/courtsService";
import type { CourtDetail } from "../../services/courtsService";

export default function DashboardCourtDetail() {
  const { id } = useParams<{ id: string }>();
  const [court, setCourt] = useState<CourtDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getCourtById(id)
      .then((data) => {
        if (!mounted) return;
        setCourt(data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!court) return;
    try {
      const updated = await toggleCourtStatus(court.id);
      setCourt((prev) => (prev ? { ...prev, ...updated } : prev));
    } catch (err) {
      console.warn(err);
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading court...</div>;
  }

  if (!court) {
    return (
      <div className="admin-empty-state">
        <h2>Court not found</h2>
        <p>The requested court record could not be found.</p>
        <Link className="admin-btn primary" to="/dashboard/courts">
          Back to Courts
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
        <Link to="/dashboard/courts">Courts</Link>
        <span aria-hidden="true">/</span>
        <span>{court.name}</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{court.name}</h1>
          <p className="admin-page-subtitle">Court profile and jurisdiction details.</p>
        </div>
        <div className="admin-action-group">
          <Link className="admin-btn ghost" to="/dashboard/courts">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to list
          </Link>
          <Link className="admin-btn secondary" to={`/dashboard/courts/${id}/edit`}>
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

      <div className="admin-detail-grid">
        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Court Information</h2>
          </div>
          <div className="admin-card-body admin-detail-list">
            <div>
              <span>Name</span>
              <strong>{court.name}</strong>
            </div>
            <div>
              <span>Slug</span>
              <strong>{court.slug}</strong>
            </div>
            <div>
              <span>Type</span>
              <strong>{court.type}</strong>
            </div>
            <div>
              <span>Jurisdiction</span>
              <strong>{court.jurisdiction}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{court.address}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{court.phones.join(", ") || "Not provided"}</strong>
            </div>
            <div>
              <span>Website</span>
              <strong>
                <a href={court.website} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>
                  {court.website}
                </a>
              </strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{court.status}</strong>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>About</h2>
          </div>
          <div className="admin-card-body">
            <p style={{ margin: 0, lineHeight: "1.5", color: "#666" }}>
              {court.about || "No description provided."}
            </p>
          </div>
        </section>

        {court.metrics && court.metrics.length > 0 && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h2>Metrics</h2>
            </div>
            <div className="admin-card-body admin-metrics-grid">
              {court.metrics.map((metric, index) => (
                <div key={index}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {court.caseTypes && court.caseTypes.length > 0 && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h2>Case Types Distribution</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-list-grid">
                {court.caseTypes.map((item, index) => (
                  <div className="admin-list-card" key={index}>
                    <strong>{item.label}</strong>
                    <span>{item.value} cases</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {court.cases && court.cases.length > 0 && (
          <section className="admin-card">
            <div className="admin-card-header">
              <h2>Cases</h2>
            </div>
            <div className="admin-card-body">
              <div className="admin-table-wrap">
                <table className="admin-table compact">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Type</th>
                      <th>Subtype</th>
                      <th>Basis Type</th>
                      <th>Filing Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {court.cases.map((item, index) => (
                      <tr key={index}>
                        <td className="admin-code">{item.id}</td>
                        <td>{item.type}</td>
                        <td>{item.subtype}</td>
                        <td>{item.basisType}</td>
                        <td>{item.filingDate}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Change court status?"
        message={`This will mark ${court.name} as ${
          court.status === "Active" ? "Inactive" : "Active"
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
