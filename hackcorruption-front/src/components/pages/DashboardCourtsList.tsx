import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { listCourts, toggleCourtStatus } from "../../services/courtsService";
import type { Court } from "../../services/courtsService";

const pageSize = 6;

export default function DashboardCourtsList() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<Court | null>(null);

  useEffect(() => {
    let mounted = true;
    listCourts()
      .then((data) => {
        if (!mounted) return;
        setCourts(data);
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
    const next = courts.filter((court) => {
      const matchesQuery =
        !query ||
        court.name.toLowerCase().includes(query) ||
        court.slug.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" ? true : court.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    return next;
  }, [courts, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleToggleStatus = async () => {
    if (!confirmTarget) return;
    try {
      const updated = await toggleCourtStatus(confirmTarget.id);
      setCourts((prev) => prev.map((court) => (court.id === updated.id ? updated : court)));
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
        <span>Courts</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Courts</h1>
          <p className="admin-page-subtitle">Manage court profiles and jurisdiction records.</p>
        </div>
        <Link className="admin-btn primary" to="/dashboard/courts/new">
          Add Court
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
          <div className="admin-loading">Loading courts...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No courts found</h3>
            <p>Try adjusting your search or filters, or add a new court.</p>
            <Link className="admin-btn primary" to="/dashboard/courts/new">
              Add Court
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Type</th>
                  <th>Jurisdiction</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((court) => (
                  <tr key={court.id}>
                    <td className="admin-strong">{court.name}</td>
                    <td className="admin-code">{court.slug}</td>
                    <td>{court.type}</td>
                    <td>{court.jurisdiction}</td>
                    <td>{court.address}</td>
                    <td>
                      <span
                        className={`admin-status-badge ${
                          court.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {court.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-group">
                        <Link className="admin-btn ghost" to={`/dashboard/courts/${court.slug}`}>
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
                        <Link className="admin-btn secondary" to={`/dashboard/courts/${court.slug}/edit`}>
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
                          onClick={() => setConfirmTarget(court)}
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
        title="Change court status?"
        message={`This will mark ${confirmTarget?.name ?? "this court"} as ${
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
