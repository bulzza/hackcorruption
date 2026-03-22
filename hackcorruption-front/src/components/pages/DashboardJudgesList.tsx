import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { listJudges, toggleJudgeStatus } from "../../services/judgesService";
import type { Judge } from "../../services/judgesService";

const pageSize = 6;

export default function DashboardJudgesList() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<Judge | null>(null);

  useEffect(() => {
    let mounted = true;
    listJudges()
      .then((data) => {
        if (!mounted) return;
        setJudges(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = judges.filter((judge) => {
      const matchesQuery =
        !query ||
        judge.full_name.toLowerCase().includes(query) ||
        judge.slug.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" ? true : judge.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    return next;
  }, [judges, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleToggleStatus = async () => {
    if (!confirmTarget) return;
    try {
      const updated = await toggleJudgeStatus(confirmTarget.id);
      setJudges((prev) => prev.map((judge) => (judge.id === updated.id ? updated : judge)));
    } catch (err) {
      console.warn(err);
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span>Judges</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Judges</h1>
          <p className="admin-page-subtitle">Manage judge profiles and assignments.</p>
        </div>
        <Link className="admin-btn primary" to="/dashboard/judges/new">
          Add Judge
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <label className="admin-form-field">
            <span>Search</span>
            <input
              className="admin-input"
              type="search"
              placeholder="Search name or slug"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="admin-form-field">
            <span>Status</span>
            <select
              className="admin-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading judges...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No judges found</h3>
            <p>Try adjusting your search or filters, or add a new judge.</p>
            <Link className="admin-btn primary" to="/dashboard/judges/new">
              Add Judge
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Full name</th>
                 
                  <th>Area of work</th>
                  <th>Year of election</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((judge) => (
                  <tr key={judge.id}>
                    <td>
                      <div className="admin-photo-thumb">
                        {judge.photoUrl ? (
                          <img src={judge.photoUrl} alt={judge.full_name} />
                        ) : (
                          <div className="admin-photo-placeholder" />
                        )}
                      </div>
                    </td>
                    <td className="admin-strong">{judge.full_name}</td>
                   
                    <td>{judge.area_of_work}</td>
                    <td>{judge.year_of_election}</td>
                    <td>
                      <span
                        className={`admin-status-badge ${
                          judge.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {judge.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-group">
                        <Link className="admin-btn ghost" to={`/dashboard/judges/${judge.id}`}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                            <path
                              d="M2 12C4.5 7 8 5 12 5C16 5 19.5 7 22 12C19.5 17 16 19 12 19C8 19 4.5 17 2 12Z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinejoin="round"
                            />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                          
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
                          
                        </Link>
                        <button
                          className="admin-btn danger"
                          type="button"
                          onClick={() => setConfirmTarget(judge)}
                        >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="admin-pagination">
          <button
            className="admin-btn ghost"
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="admin-btn ghost"
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Change judge status?"
        message={`This will mark ${confirmTarget?.full_name ?? "this judge"} as ${
          confirmTarget?.status === "Active" ? "Inactive" : "Active"
        }.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
