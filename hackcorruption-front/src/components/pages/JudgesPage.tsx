import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import judgePlaceholder from "../../assets/judge_placeholder.png";
import { listJudges } from "../../services/judgesService";
import type { Judge } from "../../services/judgesService";

const PAGE_SIZE = 9;

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

type JudgeCard = {
  id: string;
  name: string;
  area: string;
  yearOfElection: string;
  primaryCourt: string;
  photo: string;
  searchIndex: string;
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

const mapApiJudgeToCard = (judge: Judge): JudgeCard => {
  const name = normalizeText(judge.full_name) || "Unnamed judge";
  const area = normalizeText(judge.area_of_work);
  const primaryCourt = normalizeText(judge.primary_court);
  const yearOfElection = judge.year_of_election ? String(judge.year_of_election) : "";

  return {
    id: String(judge.id),
    name,
    area,
    yearOfElection,
    primaryCourt,
    photo: judge.photoUrl ?? judgePlaceholder,
    searchIndex: [name, area, primaryCourt, yearOfElection].join(" ").toLowerCase(),
  };
};

export default function JudgesPage() {
  const { t } = useI18n();
  const [judges, setJudges] = useState<JudgeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [search, setSearch] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
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

  useEffect(() => {
    setPage(1);
  }, [areaFilter, courtFilter, nameFilter, search, yearFrom, yearTo]);

  const filteredJudges = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const fromYear = Number(yearFrom);
    const toYear = Number(yearTo);
    const hasFrom = yearFrom.trim() !== "" && Number.isFinite(fromYear);
    const hasTo = yearTo.trim() !== "" && Number.isFinite(toYear);

    return judges.filter((judge) => {
      if (query && !judge.searchIndex.includes(query)) return false;
      if (!matchesTextFilter(judge.name, nameFilter)) return false;
      if (!matchesTextFilter(judge.primaryCourt, courtFilter)) return false;
      if (!matchesTextFilter(judge.area, areaFilter)) return false;

      const electionYear = Number(judge.yearOfElection);
      if (hasFrom && (!Number.isFinite(electionYear) || electionYear < fromYear)) return false;
      if (hasTo && (!Number.isFinite(electionYear) || electionYear > toYear)) return false;

      return true;
    });
  }, [areaFilter, courtFilter, deferredSearch, judges, nameFilter, yearFrom, yearTo]);

  const activeFilterCount = [nameFilter, courtFilter, areaFilter, yearFrom, yearTo].filter(
    (value) => value.trim() !== ""
  ).length;

  const totalPages = Math.max(1, Math.ceil(filteredJudges.length / PAGE_SIZE));
  const currentPage = clampPage(page, totalPages);
  const pageWindow = buildPageWindow(currentPage, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedJudges = filteredJudges.slice(pageStart, pageStart + PAGE_SIZE);
  const notProvidedLabel = t("judge_directory_not_provided");

  const resetFilters = () => {
    setSearch("");
    setNameFilter("");
    setCourtFilter("");
    setAreaFilter("");
    setYearFrom("");
    setYearTo("");
    setPage(1);
  };

  return (
    <main className="data-page directory-page-shell judge-directory-page-shell">
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

 

      <section className="judge-directory-section">
        <div className="container judge-directory-layout">
          <aside className="judge-directory-sidebar">
            <div className="judge-directory-sidebar-header">
              <div>
                <h2 className="judge-directory-sidebar-title">{t("case_directory_search_criteria")}</h2>
                <p className="judge-directory-sidebar-note">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} ${t("case_directory_filters_active")}`
                    : `${filteredJudges.length} ${t("judge_directory_matching_records")}`}
                </p>
              </div>

              <button
                className={`judge-directory-sidebar-toggle${filtersExpanded ? " expanded" : ""}`}
                type="button"
                onClick={() => setFiltersExpanded((value) => !value)}
                aria-expanded={filtersExpanded}
                aria-label={t("case_directory_search_criteria")}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {filtersExpanded ? (
              <div className="judge-directory-sidebar-body">
                <div className="directory-filter-stack judge-directory-filter-stack">
                  <label className="directory-field">
                    <span>{t("judge_directory_name")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("judge_directory_name_placeholder")}
                      value={nameFilter}
                      onChange={(event) => setNameFilter(event.target.value)}
                    />
                  </label>

                  <label className="directory-field">
                    <span>{t("case_detail_court")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("case_directory_court_placeholder")}
                      value={courtFilter}
                      onChange={(event) => setCourtFilter(event.target.value)}
                    />
                  </label>

                  <label className="directory-field">
                    <span>{t("judge_directory_area")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("judge_directory_area")}
                      value={areaFilter}
                      onChange={(event) => setAreaFilter(event.target.value)}
                    />
                  </label>

                  <div className="directory-field">
                    <span>{t("judge_directory_year_label")}</span>
                    <div className="directory-range-grid">
                      <input
                        className="directory-field-input"
                        type="number"
                        inputMode="numeric"
                        placeholder={t("judge_directory_year_from")}
                        value={yearFrom}
                        onChange={(event) => setYearFrom(event.target.value)}
                      />
                      <input
                        className="directory-field-input"
                        type="number"
                        inputMode="numeric"
                        placeholder={t("judge_directory_year_to")}
                        value={yearTo}
                        onChange={(event) => setYearTo(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button className="directory-subtle-btn judge-directory-reset-btn" type="button" onClick={resetFilters}>
                  {t("judge_directory_reset")}
                </button>
              </div>
            ) : null}
          </aside>

          <div className="judge-directory-results">
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
                <div className="judge-directory-grid">
                  {paginatedJudges.map((judge) => (
                    <Link
                      className="directory-card directory-card-link judge-directory-card judge-directory-card--reference"
                      key={judge.id}
                      to={`/data/judges/${encodeURIComponent(judge.id)}`}
                    >
                      <div className="judge-directory-photo-frame">
                        <div className="judge-directory-photo judge-directory-photo--reference" style={{ backgroundImage: `url(${judge.photo})` }} />
                      </div>

                      <div className="judge-directory-body judge-directory-body--reference">
                        <h3 className="directory-card-title judge-directory-card-title">{judge.name}</h3>
                        <p className="judge-directory-role">{t("judge_directory_role")}</p>

                     
                        <div className="judge-directory-detail-list">
                          <p className="judge-directory-detail-line">
                            <span>{t("judge_directory_elected_short")}:</span> {judge.yearOfElection || notProvidedLabel}
                          </p>
                          <p className="judge-directory-detail-line">
                            <span>{t("judge_directory_area_label")}:</span> {judge.area || notProvidedLabel}
                          </p>
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
