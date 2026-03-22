import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { listCourts } from "../../services/courtsService";
import type { Court } from "../../services/courtsService";

const PAGE_SIZE = 9;

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
};

const normalizeText = (value: string | null | undefined) => (value ?? "").trim();

const matchesTextFilter = (source: string, filter: string) =>
  filter.trim() === "" || source.toLowerCase().includes(filter.trim().toLowerCase());

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

const formatWebsite = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const mapApiCourtToCard = (court: Court): CourtCard => ({
  id: String(court.id),
  slug: court.slug || String(court.id),
  name: normalizeText(court.name) || "Unnamed court",
  type: normalizeText(court.type),
  address: normalizeText(court.address),
  phones: court.phones.map((phone) => phone.trim()).filter(Boolean),
  jurisdiction: normalizeText(court.jurisdiction),
  website: formatWebsite(court.website),
});

export default function CourtsPage() {
  const { t } = useI18n();
  const [courts, setCourts] = useState<CourtCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [courtNameFilter, setCourtNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [courtNameFilter, jurisdictionFilter, typeFilter]);

  const filteredCourts = useMemo(
    () =>
      courts.filter((court) => {
        if (!matchesTextFilter(court.name, courtNameFilter)) return false;
        if (!matchesTextFilter(court.type, typeFilter)) return false;
        if (!matchesTextFilter(court.jurisdiction, jurisdictionFilter)) return false;
        return true;
      }),
    [courtNameFilter, courts, jurisdictionFilter, typeFilter]
  );

  const activeFilterCount = [courtNameFilter, typeFilter, jurisdictionFilter].filter(
    (value) => value.trim() !== ""
  ).length;
  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / PAGE_SIZE));
  const currentPage = clampPage(page, totalPages);
  const pageWindow = buildPageWindow(currentPage, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedCourts = filteredCourts.slice(pageStart, pageStart + PAGE_SIZE);
  const notProvidedLabel = t("court_detail_not_provided");

  const resetFilters = () => {
    setCourtNameFilter("");
    setTypeFilter("");
    setJurisdictionFilter("");
    setPage(1);
  };

  return (
    <main className="data-page courts-page-shell court-directory-page-shell">
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

      <section className="court-directory-reference-section">
        <div className="container court-directory-reference-layout">
          <aside className="court-directory-reference-sidebar">
            <div className="court-directory-reference-sidebar-header">
              <div>
                <h2 className="court-directory-reference-sidebar-title">{t("case_directory_search_criteria")}</h2>
                <p className="court-directory-reference-sidebar-note">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} ${t("case_directory_filters_active")}`
                    : `${filteredCourts.length} ${t("court_directory_matching_records")}`}
                </p>
              </div>

              <button
                className={`court-directory-reference-sidebar-toggle${filtersExpanded ? " expanded" : ""}`}
                type="button"
                onClick={() => setFiltersExpanded((value) => !value)}
                aria-expanded={filtersExpanded}
                aria-label={t("case_directory_search_criteria")}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M6 8L10 12L14 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {filtersExpanded ? (
              <div className="court-directory-reference-sidebar-body">
                <div className="directory-filter-stack court-directory-reference-filter-stack">
                  <label className="directory-field">
                    <span>{t("court_directory_court_name")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("court_directory_court_name_placeholder")}
                      value={courtNameFilter}
                      onChange={(event) => setCourtNameFilter(event.target.value)}
                    />
                  </label>

                  <label className="directory-field">
                    <span>{t("court_directory_court_type")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("court_directory_court_type")}
                      value={typeFilter}
                      onChange={(event) => setTypeFilter(event.target.value)}
                    />
                  </label>

                  <label className="directory-field">
                    <span>{t("court_directory_jurisdiction")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("court_directory_jurisdiction")}
                      value={jurisdictionFilter}
                      onChange={(event) => setJurisdictionFilter(event.target.value)}
                    />
                  </label>
                </div>

                <button
                  className="directory-subtle-btn court-directory-reference-reset-btn"
                  type="button"
                  onClick={resetFilters}
                >
                  {t("court_directory_reset")}
                </button>
              </div>
            ) : null}
          </aside>

          <div className="court-directory-reference-results">
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
                <div className="court-directory-reference-grid">
                  {paginatedCourts.map((court) => {
                    const profileHref = `/data/courts/${encodeURIComponent(court.slug)}`;

                    return (
                      <article className="directory-card court-reference-card" key={court.slug}>
                        <div className="court-reference-card-body">
                          <span className="court-reference-type">{court.type || notProvidedLabel}</span>

                          <h3 className="court-reference-title">
                            <Link to={profileHref}>{court.name}</Link>
                          </h3>

                          <div className="court-reference-meta">
                            <div className="court-reference-row">
                              <span className="court-reference-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M12 21s6-5.4 6-10.2A6 6 0 106 10.8C6 15.6 12 21 12 21z"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                  />
                                  <circle cx="12" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                                </svg>
                              </span>
                              <span>{court.address || notProvidedLabel}</span>
                            </div>

                            <div className="court-reference-row">
                              <span className="court-reference-icon" aria-hidden="true">
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
                              <div className="court-reference-stack">
                                {court.phones.length > 0 ? (
                                  court.phones.map((phone) => <span key={`${court.slug}-${phone}`}>{phone}</span>)
                                ) : (
                                  <span>{notProvidedLabel}</span>
                                )}
                              </div>
                            </div>

                            <div className="court-reference-row">
                              <span className="court-reference-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M6 8h12M4 12h16M7 16h10M9 5l-5 7 5 7M15 5l5 7-5 7"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span>
                                {t("court_directory_jurisdiction")}: {court.jurisdiction || notProvidedLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        
                      </article>
                    );
                  })}
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
