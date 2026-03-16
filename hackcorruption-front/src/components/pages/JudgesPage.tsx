import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import judgePlaceholder from "../../assets/judge_placeholder.png";
import { listJudges } from "../../services/judgesService";
import type { Judge } from "../../services/judgesService";

const PAGE_SIZE_OPTIONS = [6, 9, 12] as const;

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

type JudgeCard = {
  id: string;
  name: string;
  role: string;
  area: string;
  yearOfElection: string;
  photo: string;
  searchIndex: string;
};

const mapApiJudgeToCard = (judge: Judge): JudgeCard => {
  const yearLabel = judge.year_of_election ? String(judge.year_of_election) : "";
  const area = judge.area_of_work?.trim() || "";

  return {
    id: String(judge.id),
    name: judge.full_name?.trim() || "Unnamed judge",
    role: "Judge",
    area,
    yearOfElection: yearLabel,
    photo: judge.photoUrl ?? judgePlaceholder,
    searchIndex: [judge.full_name, area, yearLabel].join(" ").toLowerCase(),
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

export default function JudgesPage() {
  const { t } = useI18n();
  const [judges, setJudges] = useState<JudgeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [nameFilter] = useState("");
  const [areaFilter] = useState("all");
  const [yearFrom] = useState("");
  const [yearTo] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(6);
  const [page, setPage] = useState(1);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let mounted = true;

    listJudges()
      .then((data) => {
        if (!mounted) return;
        setJudges(data.map(mapApiJudgeToCard));
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn(err);
        setError(err instanceof Error ? err.message : "Failed to load judges.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredJudges = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const normalizedName = nameFilter.trim().toLowerCase();
    const fromYear = Number(yearFrom);
    const toYear = Number(yearTo);
    const hasFrom = yearFrom.trim() !== "" && Number.isFinite(fromYear);
    const hasTo = yearTo.trim() !== "" && Number.isFinite(toYear);

    const next = judges.filter((judge) => {
      if (query && !judge.searchIndex.includes(query)) return false;
      if (normalizedName && !judge.name.toLowerCase().includes(normalizedName)) return false;
      if (areaFilter !== "all" && judge.area !== areaFilter) return false;

      const yearValue = Number(judge.yearOfElection);
      if (hasFrom && (!Number.isFinite(yearValue) || yearValue < fromYear)) return false;
      if (hasTo && (!Number.isFinite(yearValue) || yearValue > toYear)) return false;

      return true;
    });

    next.sort((left, right) => {
      if (sortBy === "name-desc") return right.name.localeCompare(left.name);
      if (sortBy === "year-desc") return Number(right.yearOfElection || 0) - Number(left.yearOfElection || 0);
      if (sortBy === "year-asc") return Number(left.yearOfElection || 0) - Number(right.yearOfElection || 0);
      if (sortBy === "area") return left.area.localeCompare(right.area) || left.name.localeCompare(right.name);
      return left.name.localeCompare(right.name);
    });

    return next;
  }, [areaFilter, deferredSearch, judges, nameFilter, sortBy, yearFrom, yearTo]);

  const totalPages = Math.max(1, Math.ceil(filteredJudges.length / pageSize));
  const currentPage = clampPage(page, totalPages);
  const pageWindow = buildPageWindow(currentPage, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = Math.min(currentPage * pageSize, filteredJudges.length);
  const paginatedJudges = filteredJudges.slice(pageStart, pageEnd);

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

      <section className="directory-head-section">
        <div className="container directory-head-layout search-only">
          <div className="directory-topbar">
            <label className="directory-search-label" htmlFor="judges-search">
              {t("judge_directory_search_label")}
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
                id="judges-search"
                className="directory-search-input"
                type="text"
                placeholder={t("judge_directory_search_placeholder")}
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </div>
            <div className="directory-search-meta">
              <span>
                {loading
                  ? t("judge_directory_loading_directory")
                  : `${filteredJudges.length} ${t("judge_directory_matching_records")}`}
              </span>
            </div>
          </div>

          {/* <aside className="directory-filter-panel directory-filter-panel-inline">
            <div className="directory-filter-panel-header">
              <div>
                <p className="directory-filter-eyebrow">{t("judge_directory_filter_eyebrow")}</p>
                <h2 className="directory-filter-title">{t("judge_directory_refine_results")}</h2>
              </div>
              <button className="directory-subtle-btn" type="button" onClick={resetFilters}>
                {t("judge_directory_reset")}
              </button>
            </div>

            <div className="directory-filter-stack">
              <label className="directory-field">
                <span>{t("judge_directory_name")}</span>
                <input
                  className="directory-field-input"
                  type="text"
                  placeholder={t("judge_directory_name_placeholder")}
                  value={nameFilter}
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              </label>

              <label className="directory-field">
                <span>{t("judge_directory_area")}</span>
                <select
                  className="directory-field-input"
                  value={areaFilter}
                  onChange={(event) => handleAreaChange(event.target.value)}
                >
                  <option value="all">{t("judge_directory_all_areas")}</option>
                  {areaOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="directory-range-grid">
                <label className="directory-field">
                  <span>{t("judge_directory_year_from")}</span>
                  <input
                    className="directory-field-input"
                    type="number"
                    placeholder="2010"
                    value={yearFrom}
                    onChange={(event) => handleYearFromChange(event.target.value)}
                  />
                </label>

                <label className="directory-field">
                  <span>{t("judge_directory_year_to")}</span>
                  <input
                    className="directory-field-input"
                    type="number"
                    placeholder="2026"
                    value={yearTo}
                    onChange={(event) => handleYearToChange(event.target.value)}
                  />
                </label>
              </div>
            </div>
          </aside> */}
        </div>
      </section>

      <section className="directory-content-section">
        <div className="container">
          <div className="directory-results-panel">
            <div className="directory-results-toolbar directory-results-toolbar-spaced">
              <div className="directory-results-controls">
                <label className="directory-inline-control">
                  <span>{t("judge_directory_sort")}</span>
                  <select value={sortBy} onChange={(event) => handleSortChange(event.target.value)}>
                    <option value="name-asc">{t("judge_directory_sort_name_asc")}</option>
                    <option value="name-desc">{t("judge_directory_sort_name_desc")}</option>
                    <option value="area">{t("judge_directory_sort_area")}</option>
                    <option value="year-desc">{t("judge_directory_sort_year_desc")}</option>
                    <option value="year-asc">{t("judge_directory_sort_year_asc")}</option>
                  </select>
                </label>

                <label className="directory-inline-control">
                  <span>{t("judge_directory_per_page")}</span>
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
                <h3>{t("judge_directory_loading_title")}</h3>
                <p>{t("judge_directory_loading_desc")}</p>
              </div>
            ) : error ? (
              <div className="directory-feedback-card error">
                <h3>{t("judge_directory_error_title")}</h3>
                <p>{error}</p>
              </div>
            ) : filteredJudges.length === 0 ? (
              <div className="directory-feedback-card">
                <h3>{t("judge_directory_empty_title")}</h3>
                <p>{t("judge_directory_empty_desc")}</p>
              </div>
            ) : (
              <>
                <div className="directory-card-grid judges-directory-grid">
                  {paginatedJudges.map((judge) => (
                    <Link
                      className="directory-card directory-card-link judge-directory-card"
                      key={judge.id}
                      to={`/data/judges/${encodeURIComponent(judge.id)}`}
                    >
                      <div
                        className="judge-directory-photo"
                        style={{ backgroundImage: `url(${judge.photo})` }}
                      />

                      <div className="judge-directory-body">
                        <div className="judge-directory-top">
                          <span className="judge-directory-tag">{t("judge_directory_role")}</span>
                          {judge.yearOfElection ? (
                            <span className="judge-directory-year">
                              {t("judge_directory_elected_short")} {judge.yearOfElection}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="directory-card-title">{judge.name}</h3>

                        <div className="judge-directory-meta">
                          <div className="judge-directory-meta-row">
                            <span className="judge-directory-meta-label">{t("judge_directory_area_label")}</span>
                            <span>{judge.area || t("judge_directory_not_provided")}</span>
                          </div>
                          <div className="judge-directory-meta-row">
                            <span className="judge-directory-meta-label">{t("judge_directory_year_label")}</span>
                            <span>{judge.yearOfElection || t("judge_directory_not_provided")}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="directory-pagination" aria-label="Judges pagination">
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
