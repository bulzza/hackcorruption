import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { getCourtById, getCourtCasesPage, toggleCourtStatus } from "../../services/courtsService";
import type { CourtCasesPage, CourtDetail } from "../../services/courtsService";

const DEFAULT_CASE_PAGE_SIZE = 8;
const CASE_PAGE_SIZE_OPTIONS = [5, 8, 12, 20];

type CaseStatusFilter = "All" | "Active" | "Closed" | "Unknown";

const EMPTY_CASE_PAGE: CourtCasesPage = {
  items: [],
  page: 1,
  pageSize: DEFAULT_CASE_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const windowSize = 5;
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - windowSize + 1));
  return Array.from({ length: windowSize }, (_, index) => start + index);
}

function buildCaseQueryKey(
  courtId: string,
  page: number,
  pageSize: number,
  search: string,
  status: CaseStatusFilter
) {
  return [courtId, page, pageSize, search, status].join("::");
}

export default function DashboardCourtDetail() {
  const { id } = useParams<{ id: string }>();
  const [court, setCourt] = useState<CourtDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [caseSearchInput, setCaseSearchInput] = useState("");
  const [caseSearch, setCaseSearch] = useState("");
  const [caseStatusFilter, setCaseStatusFilter] = useState<CaseStatusFilter>("All");
  const [casePageSize, setCasePageSize] = useState(DEFAULT_CASE_PAGE_SIZE);
  const [casePage, setCasePage] = useState(1);
  const [caseData, setCaseData] = useState<CourtCasesPage>(EMPTY_CASE_PAGE);
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError, setCasesError] = useState("");
  const [loadedCaseKey, setLoadedCaseKey] = useState("");
  const caseCacheRef = useRef<Record<string, CourtCasesPage>>({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCaseSearch(caseSearchInput.trim());
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [caseSearchInput]);

  useEffect(() => {
    let mounted = true;

    caseCacheRef.current = {};
    setLoadedCaseKey("");
    setCaseData(EMPTY_CASE_PAGE);
    setCasesError("");
    setCasesLoading(false);
    setCasePage(1);
    setLoading(true);

    if (!id) {
      setCourt(null);
      setLoading(false);
      return;
    }

    getCourtById(id, { includeCases: false })
      .then((data) => {
        if (!mounted) return;
        setCourt(data ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setCourt(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    setCasePage(1);
  }, [casePageSize, caseSearch, caseStatusFilter, court?.id]);

  const caseQueryKey = id
    ? buildCaseQueryKey(id, casePage, casePageSize, caseSearch, caseStatusFilter)
    : "";
  const hasCurrentCaseData = loadedCaseKey === caseQueryKey;

  useEffect(() => {
    if (!id || !court?.id) return;

    const cachedPage = caseCacheRef.current[caseQueryKey];
    if (cachedPage) {
      setCaseData(cachedPage);
      setLoadedCaseKey(caseQueryKey);
      setCasesError("");
      setCasesLoading(false);
      return;
    }

    let cancelled = false;

    const prefetchPage = (pageNumber: number, totalPages: number) => {
      if (pageNumber > totalPages) return;

      const nextKey = buildCaseQueryKey(id, pageNumber, casePageSize, caseSearch, caseStatusFilter);
      if (caseCacheRef.current[nextKey]) return;

      void getCourtCasesPage(id, {
        page: pageNumber,
        pageSize: casePageSize,
        search: caseSearch,
        status: caseStatusFilter,
      })
        .then((nextPage) => {
          caseCacheRef.current[nextKey] = nextPage;
        })
        .catch(() => undefined);
    };

    setCasesLoading(true);
    setCasesError("");

    getCourtCasesPage(id, {
      page: casePage,
      pageSize: casePageSize,
      search: caseSearch,
      status: caseStatusFilter,
    })
      .then((data) => {
        if (cancelled) return;
        const resolvedKey = buildCaseQueryKey(id, data.page, casePageSize, caseSearch, caseStatusFilter);
        caseCacheRef.current[resolvedKey] = data;
        setCaseData(data);
        setLoadedCaseKey(resolvedKey);
        if (data.page !== casePage) {
          setCasePage(data.page);
        }
        setCasesLoading(false);
        prefetchPage(data.page + 1, data.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setCasesError(err instanceof Error ? err.message : "Failed to load case files.");
        setCasesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [casePage, casePageSize, caseQueryKey, caseSearch, caseStatusFilter, court?.id, id]);

  const totalCases = court?.caseSummary.total ?? 0;
  const activeCases = court?.caseSummary.active ?? 0;
  const closedCases = court?.caseSummary.closed ?? 0;
  const unknownCases = court?.caseSummary.unknown ?? 0;
  const filteredTotal = hasCurrentCaseData ? caseData.total : 0;
  const totalCasePages = hasCurrentCaseData ? caseData.totalPages : 1;
  const caseRows = hasCurrentCaseData ? caseData.items : [];
  const visibleCasePages = getVisiblePages(casePage, totalCasePages);
  const caseShowingFrom = filteredTotal === 0 ? 0 : (casePage - 1) * casePageSize + 1;
  const caseShowingTo =
    filteredTotal === 0 ? 0 : Math.min((casePage - 1) * casePageSize + caseRows.length, filteredTotal);
  const hasCaseFilters = caseSearchInput.trim().length > 0 || caseStatusFilter !== "All";

  useEffect(() => {
    if (casePage > totalCasePages) {
      setCasePage(totalCasePages);
    }
  }, [casePage, totalCasePages]);

  const resetCaseFilters = () => {
    setCaseSearchInput("");
    setCaseSearch("");
    setCaseStatusFilter("All");
    setCasePageSize(DEFAULT_CASE_PAGE_SIZE);
    setCasePage(1);
  };

  const handleToggleStatus = async () => {
    if (!court) return;
    try {
      const updated = await toggleCourtStatus(court.slug);
      setCourt((prev) => (prev ? { ...prev, status: updated.status } : prev));
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
                {court.website ? (
                  <a href={court.website} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>
                    {court.website}
                  </a>
                ) : (
                  "Not provided"
                )}
              </strong>
            </div>
            <div>
              <span>Status</span>
              <strong>
                <span
                  className={`admin-status-badge ${
                    court.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  {court.status}
                </span>
              </strong>
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

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Case Files</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-content-stack">
              <div className="admin-summary-grid">
                <div className="admin-summary-card">
                  <span>Total case files</span>
                  <strong>{totalCases}</strong>
                </div>
                <div className="admin-summary-card">
                  <span>Active</span>
                  <strong>{activeCases}</strong>
                </div>
                <div className="admin-summary-card">
                  <span>Closed</span>
                  <strong>{closedCases}</strong>
                </div>
                <div className="admin-summary-card">
                  <span>Unknown status</span>
                  <strong>{unknownCases}</strong>
                </div>
              </div>

              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <label className="admin-form-field">
                    <span>Search case files</span>
                    <input
                      className="admin-input"
                      type="search"
                      placeholder="Search case ID, type, or basis"
                      value={caseSearchInput}
                      onChange={(e) => setCaseSearchInput(e.target.value)}
                    />
                  </label>
                  <label className="admin-form-field">
                    <span>Status</span>
                    <select
                      className="admin-input"
                      value={caseStatusFilter}
                      onChange={(e) => setCaseStatusFilter(e.target.value as CaseStatusFilter)}
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </label>
                </div>

                <div className="admin-toolbar-right">
                  <div className="admin-toolbar-meta">
                    {casesLoading && !hasCurrentCaseData
                      ? "Loading case files..."
                      : `Showing ${caseShowingFrom}-${caseShowingTo} of ${filteredTotal} case files`}
                  </div>
                  <label className="admin-form-field admin-form-field-sm">
                    <span>Rows</span>
                    <select
                      className="admin-input"
                      value={casePageSize}
                      onChange={(e) => setCasePageSize(Number(e.target.value))}
                    >
                      {CASE_PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size} per page
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="admin-btn ghost"
                    type="button"
                    onClick={resetCaseFilters}
                    disabled={!hasCaseFilters && casePageSize === DEFAULT_CASE_PAGE_SIZE}
                  >
                    Reset filters
                  </button>
                </div>
              </div>

              {totalCases === 0 ? (
                <div className="admin-empty-inline">No case files recorded for this court.</div>
              ) : casesError ? (
                <div className="admin-empty-inline">{casesError}</div>
              ) : casesLoading && !hasCurrentCaseData ? (
                <div className="admin-loading">Loading case files...</div>
              ) : filteredTotal === 0 ? (
                <div className="admin-empty-inline">No case files match the current filters.</div>
              ) : (
                <>
                  <div className="admin-table-wrap">
                    <table className="admin-table compact">
                      <thead>
                        <tr>
                          <th>Case ID</th>
                          <th>Type</th>
                          <th>Basis Type</th>
                          <th>Filing Date</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {caseRows.map((item) => (
                          <tr key={item.recordKey ?? item.id}>
                            <td className="admin-code">{item.id}</td>
                            <td>{item.type || "N/A"}</td>
                            <td>{item.basisType || item.subtype || "N/A"}</td>
                            <td>{item.filingDate || "N/A"}</td>
                            <td>
                              <span
                                className={`admin-status-badge ${
                                  item.status === "Active"
                                    ? "active"
                                    : item.status === "Closed"
                                      ? "inactive"
                                      : "neutral"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>
                              {item.recordKey ? (
                                <Link
                                  className="admin-btn ghost"
                                  to={`/dashboard/cases/${encodeURIComponent(item.recordKey)}`}
                                >
                                  View
                                </Link>
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-pagination admin-pagination-inline">
                    <span>
                      Page {casePage} of {totalCasePages}
                    </span>
                    <div className="admin-pagination-group">
                      <button
                        className="admin-btn ghost"
                        type="button"
                        disabled={casePage === 1 || casesLoading}
                        onClick={() => setCasePage((prev) => Math.max(1, prev - 1))}
                      >
                        Previous
                      </button>
                      {visibleCasePages.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          className={`admin-btn ${pageNumber === casePage ? "secondary" : "ghost"}`}
                          type="button"
                          disabled={casesLoading}
                          onClick={() => setCasePage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        className="admin-btn ghost"
                        type="button"
                        disabled={casePage === totalCasePages || casesLoading}
                        onClick={() => setCasePage((prev) => Math.min(totalCasePages, prev + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
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
