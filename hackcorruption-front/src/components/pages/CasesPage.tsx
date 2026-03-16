import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { listCases } from "../../services/casesService";
import type { Case } from "../../services/casesService";

const PAGE_SIZE_OPTIONS = [12, 24, 48] as const;
const DEFAULT_RECENT_LIMIT = 100;

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

type CaseCard = {
  recordKey: string;
  id: string;
  court: string;
  judge: string;
  legalArea: string;
  decisionDate: string;
  summary: string;
  status: string;
  decisionTimestamp: number;
  searchIndex: string;
};

const formatDisplayDate = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return raw;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(parsed));
};

const toTimestamp = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) return 0;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeStatus = (value: string | null | undefined) => {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "closed") return "Closed";
  if (normalized === "inactive") return "Inactive";
  return "Unknown";
};

const mapApiCaseToCard = (item: Case): CaseCard => {
  const court = item.court?.trim() || "";
  const judge = item.judge?.trim() || "";
  const legalArea = item.legal_area?.trim() || "";
  const summary = item.summary?.trim() || "";
  const decisionDate = item.decision_date?.trim() || "";
  const status = normalizeStatus(item.case_status);

  return {
    recordKey: item.record_key,
    id: item.id,
    court,
    judge,
    legalArea,
    decisionDate,
    summary,
    status,
    decisionTimestamp: toTimestamp(decisionDate),
    searchIndex: [item.id, court, judge, legalArea, summary, status].join(" ").toLowerCase(),
  };
};

const clampPage = (page: number, totalPages: number) => {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(page, 1), totalPages);
};

const buildPageWindow = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
};

const truncateText = (value: string, length: number) => {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
};

export default function CasesPage() {
  const { t } = useI18n();
  const [cases, setCases] = useState<CaseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [judgeFilter, setJudgeFilter] = useState("");
  const [legalAreaFilter, setLegalAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(12);
  const [page, setPage] = useState(1);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    listCases()
      .then((data) => {
        if (!mounted) return;
        setCases(data.map(mapApiCaseToCard));
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn(err);
        setError(err instanceof Error ? err.message : "Failed to load cases.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const legalAreaOptions = useMemo(
    () => Array.from(new Set(cases.map((item) => item.legalArea).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [cases]
  );

  const filteredCases = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const courtQuery = courtFilter.trim().toLowerCase();
    const judgeQuery = judgeFilter.trim().toLowerCase();
    const fromTimestamp = dateFrom ? Date.parse(dateFrom) : null;
    const toTimestampValue = dateTo ? Date.parse(dateTo) : null;

    const next = cases.filter((item) => {
      if (query && !item.searchIndex.includes(query)) return false;
      if (courtQuery && !item.court.toLowerCase().includes(courtQuery)) return false;
      if (judgeQuery && !item.judge.toLowerCase().includes(judgeQuery)) return false;
      if (legalAreaFilter !== "all" && item.legalArea !== legalAreaFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      if (fromTimestamp !== null && !Number.isNaN(fromTimestamp) && item.decisionTimestamp < fromTimestamp) {
        return false;
      }

      if (toTimestampValue !== null && !Number.isNaN(toTimestampValue) && item.decisionTimestamp > toTimestampValue) {
        return false;
      }

      return true;
    });

    next.sort((left, right) => {
      if (sortBy === "oldest") return left.decisionTimestamp - right.decisionTimestamp;
      if (sortBy === "court") return left.court.localeCompare(right.court) || right.decisionTimestamp - left.decisionTimestamp;
      if (sortBy === "judge") return left.judge.localeCompare(right.judge) || right.decisionTimestamp - left.decisionTimestamp;
      if (sortBy === "status") return left.status.localeCompare(right.status) || right.decisionTimestamp - left.decisionTimestamp;
      return right.decisionTimestamp - left.decisionTimestamp;
    });

    return next;
  }, [cases, courtFilter, dateFrom, dateTo, deferredSearch, judgeFilter, legalAreaFilter, sortBy, statusFilter]);

  const hasScopedSearch =
    deferredSearch.trim() !== "" ||
    courtFilter.trim() !== "" ||
    judgeFilter.trim() !== "" ||
    legalAreaFilter !== "all" ||
    statusFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  const visibleCases = useMemo(
    () => (hasScopedSearch ? filteredCases : filteredCases.slice(0, DEFAULT_RECENT_LIMIT)),
    [filteredCases, hasScopedSearch]
  );

  const totalPages = Math.max(1, Math.ceil(visibleCases.length / pageSize));
  const currentPage = clampPage(page, totalPages);
  const pageWindow = buildPageWindow(currentPage, totalPages);
  const showingFrom = visibleCases.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, visibleCases.length);
  const paginatedCases = visibleCases.slice(showingFrom === 0 ? 0 : showingFrom - 1, showingTo);

  const getStatusLabel = (status: string) => {
    if (status === "Active") return t("status_active");
    if (status === "Closed") return t("status_closed");
    if (status === "Inactive") return t("status_inactive");
    return t("status_unknown");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCourtFilter("");
    setJudgeFilter("");
    setLegalAreaFilter("all");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("recent");
    setPage(1);
  };

  return (
    <main className="data-page directory-page-shell">
      <div className="data-tabs">
        <NavLink to="/data/courts" end className={tabClass}>
          {t("data_tab_courts")}
        </NavLink>
        <NavLink to="/data/judges" end className={tabClass}>
          {t("data_tab_judges")}
        </NavLink>
        <NavLink to="/data/cases" end className={tabClass}>
          {t("data_tab_cases")}
        </NavLink>
      </div>

      <section className="directory-topbar-section">
        <div className="container directory-topbar">
          <label className="directory-search-label" htmlFor="cases-search">
            {t("case_directory_search_label")}
          </label>
          <div className="directory-search-input-wrap">
            <span className="directory-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.134 18 4 14.866 4 11C4 7.134 7.134 4 11 4C14.866 4 18 7.134 18 11Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="cases-search"
              className="directory-search-input"
              type="text"
              placeholder={t("case_directory_search_placeholder")}
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>
          <div className="directory-search-meta">
            <span>
              {loading
                ? t("case_directory_loading_directory")
                : `${visibleCases.length} ${t("case_directory_matching_records")}`}
            </span>
            {!hasScopedSearch && !loading ? (
              <span>{t("case_directory_recent_limit_note")}</span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="directory-content-section">
        <div className="container directory-layout">
          <aside className="directory-filter-panel">
            <div className="directory-filter-panel-header">
              <div>
                <p className="directory-filter-eyebrow">{t("case_directory_filter_eyebrow")}</p>
                <h2 className="directory-filter-title">{t("case_directory_refine_results")}</h2>
              </div>
              <button className="directory-subtle-btn" type="button" onClick={resetFilters}>
                {t("case_directory_reset")}
              </button>
            </div>

            <div className="directory-filter-stack">
              <label className="directory-field">
                <span>{t("case_directory_court")}</span>
                <input
                  className="directory-field-input"
                  type="text"
                  placeholder={t("case_directory_court_placeholder")}
                  value={courtFilter}
                  onChange={(event) => {
                    setCourtFilter(event.target.value);
                    setPage(1);
                  }}
                />
              </label>

              <label className="directory-field">
                <span>{t("case_directory_judge")}</span>
                <input
                  className="directory-field-input"
                  type="text"
                  placeholder={t("case_directory_judge_placeholder")}
                  value={judgeFilter}
                  onChange={(event) => {
                    setJudgeFilter(event.target.value);
                    setPage(1);
                  }}
                />
              </label>

              <label className="directory-field">
                <span>{t("case_directory_legal_area")}</span>
                <select
                  className="directory-field-input"
                  value={legalAreaFilter}
                  onChange={(event) => {
                    setLegalAreaFilter(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">{t("case_directory_all_areas")}</option>
                  {legalAreaOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="directory-field">
                <span>{t("case_directory_status")}</span>
                <select
                  className="directory-field-input"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">{t("case_directory_all_statuses")}</option>
                  <option value="Active">{t("status_active")}</option>
                  <option value="Closed">{t("status_closed")}</option>
                  <option value="Inactive">{t("status_inactive")}</option>
                  <option value="Unknown">{t("status_unknown")}</option>
                </select>
              </label>

              <div className="directory-range-grid">
                <label className="directory-field">
                  <span>{t("case_directory_date_from")}</span>
                  <input
                    className="directory-field-input"
                    type="date"
                    value={dateFrom}
                    onChange={(event) => {
                      setDateFrom(event.target.value);
                      setPage(1);
                    }}
                  />
                </label>

                <label className="directory-field">
                  <span>{t("case_directory_date_to")}</span>
                  <input
                    className="directory-field-input"
                    type="date"
                    value={dateTo}
                    onChange={(event) => {
                      setDateTo(event.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              </div>
            </div>
          </aside>

          <div className="directory-results-panel">
            <div className="directory-results-toolbar directory-results-toolbar-spaced">
              <div>
                <h2 className="directory-results-title">
                  {loading
                    ? t("case_directory_preparing_records")
                    : `${t("case_directory_showing_results")} ${showingFrom}-${showingTo} ${t("case_directory_of")} ${visibleCases.length}`}
                </h2>
              </div>

              <div className="directory-results-controls">
                <label className="directory-inline-control">
                  <span>{t("case_directory_sort")}</span>
                  <select
                    value={sortBy}
                    onChange={(event) => {
                      setSortBy(event.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="recent">{t("case_directory_sort_recent")}</option>
                    <option value="oldest">{t("case_directory_sort_oldest")}</option>
                    <option value="court">{t("case_directory_sort_court")}</option>
                    <option value="judge">{t("case_directory_sort_judge")}</option>
                    <option value="status">{t("case_directory_sort_status")}</option>
                  </select>
                </label>

                <label className="directory-inline-control">
                  <span>{t("case_directory_per_page")}</span>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
                      setPage(1);
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="directory-feedback-card">
                <h3>{t("case_directory_loading_title")}</h3>
                <p>{t("case_directory_loading_desc")}</p>
              </div>
            ) : error ? (
              <div className="directory-feedback-card error">
                <h3>{t("case_directory_error_title")}</h3>
                <p>{error}</p>
              </div>
            ) : visibleCases.length === 0 ? (
              <div className="directory-feedback-card">
                <h3>{t("case_directory_empty_title")}</h3>
                <p>{t("case_directory_empty_desc")}</p>
              </div>
            ) : (
              <>
                <div className="directory-card-grid cases-directory-grid">
                  {paginatedCases.map((item) => (
                    <article className="directory-card case-directory-card" key={item.recordKey}>
                      <div className="case-directory-body">
                        <div className="case-directory-top">
                          <span className={`case-directory-status ${item.status.toLowerCase()}`}>
                            {getStatusLabel(item.status)}
                          </span>
                          <span className="case-directory-date">
                            {formatDisplayDate(item.decisionDate) || t("case_detail_not_provided")}
                          </span>
                        </div>

                        <Link className="directory-card-title" to={`/data/cases/${encodeURIComponent(item.id)}`}>
                          {item.id}
                        </Link>

                        <div className="case-directory-subtitle">
                          <span>{item.court || t("case_detail_not_provided")}</span>
                          <span>{item.legalArea || t("case_detail_not_provided")}</span>
                        </div>

                        <p className="case-directory-summary">
                          {truncateText(item.summary || t("case_detail_not_provided"), 220)}
                        </p>

                        <div className="case-directory-meta">
                          <div className="case-directory-meta-row">
                            <span className="case-directory-meta-label">{t("case_directory_judge")}</span>
                            <span>{item.judge || t("case_detail_not_provided")}</span>
                          </div>
                        </div>

                        <div className="directory-card-actions">
                          <Link className="directory-primary-link" to={`/data/cases/${encodeURIComponent(item.id)}`}>
                            {t("case_directory_open_case")}
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="directory-pagination" aria-label="Cases pagination">
                  <button
                    className="directory-pagination-btn"
                    type="button"
                    onClick={() => setPage((value) => Math.max(value - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {t("pagination_previous")}
                  </button>

                  <div className="directory-pagination-pages">
                    {pageWindow.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        className={`directory-pagination-page ${pageNumber === currentPage ? "active" : ""}`}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    className="directory-pagination-btn"
                    type="button"
                    onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {t("pagination_next")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
