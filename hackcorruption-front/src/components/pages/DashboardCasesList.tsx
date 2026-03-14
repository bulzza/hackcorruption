import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { deleteCase, listDashboardCases } from "../../services/casesService";
import type { Case } from "../../services/casesService";

const pageSize = 6;

export default function DashboardCasesList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [legalAreaFilter, setLegalAreaFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<Case | null>(null);

  useEffect(() => {
    let mounted = true;
    listDashboardCases()
      .then((data) => {
        if (!mounted) return;
        setCases(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, legalAreaFilter]);

  const legalAreas = useMemo(() => {
    const values = new Set(
      cases
        .map((item) => item.legal_area?.trim())
        .filter((value): value is string => Boolean(value))
    );
    return ["All", ...Array.from(values).sort()];
  }, [cases]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cases.filter((item) => {
      const matchesQuery =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.record_key.toLowerCase().includes(query) ||
        item.court.toLowerCase().includes(query) ||
        (item.judge ?? "").toLowerCase().includes(query) ||
        (item.legal_area ?? "").toLowerCase().includes(query) ||
        (item.summary ?? "").toLowerCase().includes(query) ||
        (item.case_status ?? "").toLowerCase().includes(query);
      const matchesLegalArea =
        legalAreaFilter === "All" ? true : item.legal_area === legalAreaFilter;
      return matchesQuery && matchesLegalArea;
    });
  }, [cases, legalAreaFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleDelete = async () => {
    if (!confirmTarget || !confirmTarget.can_delete) return;
    try {
      await deleteCase(confirmTarget.record_key);
      setCases((prev) => prev.filter((item) => item.record_key !== confirmTarget.record_key));
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
        <span>Cases</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cases</h1>
          <p className="admin-page-subtitle">Browse registry cases and court-file records in one place.</p>
        </div>
        <Link className="admin-btn primary" to="/dashboard/cases/new">
          Add Case
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <label className="admin-form-field">
            <span>Search</span>
            <input
              className="admin-input"
              type="search"
              placeholder="Search case ID, court, status, or summary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="admin-form-field">
            <span>Legal area</span>
            <select
              className="admin-input"
              value={legalAreaFilter}
              onChange={(e) => setLegalAreaFilter(e.target.value)}
            >
              {legalAreas.map((area) => (
                <option value={area} key={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading cases...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No cases found</h3>
            <p>Try adjusting your search or filters, or add a new case.</p>
            <Link className="admin-btn primary" to="/dashboard/cases/new">
              Add Case
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table admin-cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Source</th>
                  <th>Court</th>
                  <th>Judge</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Legal area</th>
                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((item) => (
                  <tr key={item.record_key}>
                    <td className="admin-code">{item.id}</td>
                    <td>
                      <span
                        className={`admin-status-badge ${
                          item.source === "court_file" ? "neutral" : "active"
                        }`}
                      >
                        {item.source === "court_file" ? "Court file" : "Registry"}
                      </span>
                    </td>
                    <td className="admin-strong">{item.court}</td>
                    <td>{item.judge ?? "N/A"}</td>
                    <td>{item.decision_date ?? "N/A"}</td>
                    <td>{item.case_status ?? "N/A"}</td>
                    <td>{item.legal_area ?? "N/A"}</td>
                    
                    <td>
                      <div className="admin-action-group">
                        <Link
                          className="admin-btn ghost"
                          to={`/dashboard/cases/${encodeURIComponent(item.record_key)}`}
                        >
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
                        {item.can_edit && (
                          <Link
                            className="admin-btn secondary"
                            to={`/dashboard/cases/${encodeURIComponent(item.record_key)}/edit`}
                          >
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
                        )}
                        {item.can_delete && (
                          <button
                            className="admin-btn danger"
                            type="button"
                            onClick={() => setConfirmTarget(item)}
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
                        )}
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
        open={Boolean(confirmTarget && confirmTarget.can_delete)}
        title="Delete case?"
        message={`This will permanently remove ${confirmTarget?.id ?? "this case"} and its details.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
