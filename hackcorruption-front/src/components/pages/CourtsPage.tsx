import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { listCourts } from "../../services/courtsService";
import type { Court, CourtStatus } from "../../services/courtsService";

const PAGE_SIZE_OPTIONS = [6, 9, 12] as const;

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

type CourtCard = {
  id: string;
  slug: string;
  name: string;
  type: string;
  address: string;
  phones: string[];
  jurisdiction: string;
  website: string;
  websiteLabel: string;
  status: CourtStatus;
  searchIndex: string;
};

const formatWebsite = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) {
    return { href: "", label: "" };
  }

  const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(href);
    return {
      href,
      label: url.hostname.replace(/^www\./i, ""),
    };
  } catch {
    return {
      href,
      label: raw,
    };
  }
};

const mapApiCourtToCard = (court: Court): CourtCard => {
  const website = formatWebsite(court.website);
  const address = court.address?.trim() || "";
  const jurisdiction = court.jurisdiction?.trim() || "";
  const type = court.type?.trim() || "Court";
  const phones = court.phones.filter((phone) => phone.trim() !== "");

  return {
    id: String(court.id),
    slug: court.slug || String(court.id),
    name: court.name?.trim() || "Unnamed court",
    type,
    address,
    phones,
    jurisdiction,
    website: website.href,
    websiteLabel: website.label,
    status: court.status,
    searchIndex: [court.name, type, address, jurisdiction, phones.join(" "), website.label]
      .join(" ")
      .toLowerCase(),
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

export default function CourtsPage() {
  const { t } = useI18n();
  const [courts, setCourts] = useState<CourtCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [courtName] = useState("");
  const [typeFilter] = useState("all");
  const [jurisdictionFilter] = useState("all");
  const [statusFilter] = useState<"all" | CourtStatus>("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(6);
  const [page, setPage] = useState(1);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    listCourts()
      .then((data) => {
        if (!mounted) return;
        setCourts(data.map(mapApiCourtToCard));
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn(err);
        setError(err instanceof Error ? err.message : "Failed to load courts.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const nameQuery = courtName.trim().toLowerCase();

    const next = courts.filter((court) => {
      if (query && !court.searchIndex.includes(query)) return false;
      if (nameQuery && !court.name.toLowerCase().includes(nameQuery)) return false;
      if (typeFilter !== "all" && court.type !== typeFilter) return false;
      if (jurisdictionFilter !== "all" && court.jurisdiction !== jurisdictionFilter) return false;
      if (statusFilter !== "all" && court.status !== statusFilter) return false;
      return true;
    });

    next.sort((left, right) => {
      if (sortBy === "name-desc") return right.name.localeCompare(left.name);
      if (sortBy === "jurisdiction") return left.jurisdiction.localeCompare(right.jurisdiction);
      if (sortBy === "status") return left.status.localeCompare(right.status) || left.name.localeCompare(right.name);
      return left.name.localeCompare(right.name);
    });

    return next;
  }, [courts, courtName, deferredSearch, jurisdictionFilter, sortBy, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / pageSize));
  const currentPage = clampPage(page, totalPages);
  const pageWindow = buildPageWindow(currentPage, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = Math.min(currentPage * pageSize, filteredCourts.length);
  const paginatedCourts = filteredCourts.slice(pageStart, pageEnd);

  const getStatusLabel = (status: CourtStatus) =>
    status === "Active" ? t("status_active") : t("status_inactive");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: (typeof PAGE_SIZE_OPTIONS)[number]) => {
    setPageSize(value);
    setPage(1);
  };

  return (
    <main className="data-page courts-page-shell">
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

      <section className="directory-head-section">
        <div className="container directory-head-layout search-only">
          <div className="directory-topbar">
            <label className="directory-search-label" htmlFor="courts-search">
              {t("court_directory_search_label")}
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
                id="courts-search"
                className="directory-search-input"
                type="text"
                placeholder={t("court_directory_search_placeholder")}
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
              {search ? (
                <button className="directory-subtle-btn directory-search-clear-btn" type="button" onClick={() => handleSearchChange("")}>
                  {t("court_directory_reset")}
                </button>
              ) : null}
            </div>

            <div className="directory-search-meta">
              <span>
                {loading
                  ? t("court_directory_loading_directory")
                  : `${filteredCourts.length} ${t("court_directory_matching_records")}`}
              </span>
            </div>
          </div>

          {/* <aside className="directory-filter-panel directory-filter-panel-inline">
            <div className="directory-filter-panel-header">
              <div>
                <p className="directory-filter-eyebrow">{t("court_directory_filter_eyebrow")}</p>
                <h2 className="directory-filter-title">{t("court_directory_refine_results")}</h2>
              </div>
              <button className="directory-subtle-btn" type="button" onClick={resetFilters}>
                {t("court_directory_reset")}
              </button>
            </div>

            <div className="directory-filter-stack">
              <label className="directory-field">
                <span>{t("court_directory_court_name")}</span>
                <input
                  className="directory-field-input"
                  type="text"
                  placeholder={t("court_directory_court_name_placeholder")}
                  value={courtName}
                  onChange={(event) => handleCourtNameChange(event.target.value)}
                />
              </label>

              <label className="directory-field">
                <span>{t("court_directory_court_type")}</span>
                <select
                  className="directory-field-input"
                  value={typeFilter}
                  onChange={(event) => handleTypeFilterChange(event.target.value)}
                >
                  <option value="all">{t("court_directory_all_court_types")}</option>
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="directory-field">
                <span>{t("court_directory_jurisdiction")}</span>
                <select
                  className="directory-field-input"
                  value={jurisdictionFilter}
                  onChange={(event) => handleJurisdictionFilterChange(event.target.value)}
                >
                  <option value="all">{t("court_directory_all_jurisdictions")}</option>
                  {jurisdictionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="directory-field">
                <span>{t("court_directory_status")}</span>
                <select
                  className="directory-field-input"
                  value={statusFilter}
                  onChange={(event) => handleStatusFilterChange(event.target.value as "all" | CourtStatus)}
                >
                  <option value="all">{t("court_directory_all_statuses")}</option>
                  <option value="Active">{t("status_active")}</option>
                  <option value="Inactive">{t("status_inactive")}</option>
                </select>
              </label>
            </div>
          </aside> */}
        </div>
      </section>

      <section className="directory-content-section">
        <div className="container">
          <div className="directory-results-panel">
            <div className="directory-results-toolbar  directory-results-toolbar-spaced">
              <div className="directory-results-controls">
                <label className="directory-inline-control">
                  <span>{t("court_directory_sort")}</span>
                  <select value={sortBy} onChange={(event) => handleSortChange(event.target.value)}>
                    <option value="name-asc">{t("court_directory_sort_name_asc")}</option>
                    <option value="name-desc">{t("court_directory_sort_name_desc")}</option>
                    <option value="jurisdiction">{t("court_directory_sort_jurisdiction")}</option>
                    <option value="status">{t("court_directory_sort_status")}</option>
                  </select>
                </label>

                <label className="directory-inline-control">
                  <span>{t("court_directory_per_page")}</span>
                  <select
                    value={pageSize}
                    onChange={(event) =>
                      handlePageSizeChange(Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number])
                    }
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
                <h3>{t("court_directory_loading_title")}</h3>
                <p>{t("court_directory_loading_desc")}</p>
              </div>
            ) : error ? (
              <div className="directory-feedback-card error">
                <h3>{t("court_directory_error_title")}</h3>
                <p>{error}</p>
              </div>
            ) : filteredCourts.length === 0 ? (
              <div className="directory-feedback-card">
                <h3>{t("court_directory_empty_title")}</h3>
                <p>{t("court_directory_empty_desc")}</p>
              </div>
            ) : (
              <>
                <div className="directory-card-grid courts-directory-grid">
                  {paginatedCourts.map((court) => (
                    <Link
                      className="directory-card directory-card-link court-directory-card"
                      key={court.slug}
                      to={`/data/courts/${encodeURIComponent(court.slug)}`}
                    >
                      <div className="court-directory-card-top">
                        <span className="court-directory-tag">{court.type}</span>
                        <span className={`court-directory-status ${court.status.toLowerCase()}`}>
                          {getStatusLabel(court.status)}
                        </span>
                      </div>

                      <h3 className="court-directory-name">{court.name}</h3>

                      <p className="court-directory-summary">{court.jurisdiction}</p>

                      <div className="court-directory-meta">
                        <div className="court-directory-row">
                          <span className="court-directory-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                              <path
                                d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              />
                              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                          </span>
                          <span>{court.address || t("court_detail_not_provided")}</span>
                        </div>

                        <div className="court-directory-row">
                          <span className="court-directory-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                              <path
                                d="M4 5.5C4 4.67 4.67 4 5.5 4h2.1c.5 0 .95.31 1.1.79l.7 2.1c.12.38 0 .8-.29 1.06l-1.05.95a12.3 12.3 0 006.89 6.89l.95-1.05c.26-.29.68-.41 1.06-.29l2.1.7c.48.15.79.6.79 1.1v2.1c0 .83-.67 1.5-1.5 1.5A15.5 15.5 0 014 5.5z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span>{court.phones.length > 0 ? court.phones.join(", ") : t("court_detail_not_provided")}</span>
                        </div>

                        <div className="court-directory-row">
                          <span className="court-directory-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none">
                              <path
                                d="M4 12h16M12 4c2.5 2.2 4 5.03 4 8s-1.5 5.8-4 8c-2.5-2.2-4-5.03-4-8s1.5-5.8 4-8z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span>{court.websiteLabel || t("court_directory_no_website")}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="directory-pagination" aria-label="Courts pagination">
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
