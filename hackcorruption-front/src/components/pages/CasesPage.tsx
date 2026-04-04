import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import DataSectionHeader from "../layout/DataSectionHeader";
import { listCases } from "../../services/casesService";
import type { Case } from "../../services/casesService";

const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

type CaseCard = {
  recordKey: string;
  id: string;
  court: string;
  judge: string;
  legalArea: string;
  summary: string;
  decisionDate: string;
  decisionTimestamp: number;
  status: string;
  caseType: string;
  caseSubtype: string;
  basisType: string;
  basis: string;
  articles: string;
  caseCost: number | null;
  totalCaseCost: number | null;
  downloadLink: string;
  tagLabel: string;
};

const formatDisplayDate = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return raw;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
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

const normalizeText = (value: string | null | undefined) => (value ?? "").trim();

const truncateText = (value: string, length: number) => {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
};

const parseNumberFilter = (value: string) => {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const matchesTextFilter = (source: string, filter: string) =>
  filter.trim() === "" || source.toLowerCase().includes(filter.trim().toLowerCase());

const matchesNumericRange = (value: number | null, min: number | null, max: number | null) => {
  if (min === null && max === null) return true;
  if (value === null) return false;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
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

const uniqueSortedValues = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter((value) => value !== ""))).sort((left, right) =>
    left.localeCompare(right)
  );

const mapApiCaseToCard = (item: Case): CaseCard => {
  const court = normalizeText(item.court);
  const judge = normalizeText(item.judge);
  const legalArea = normalizeText(item.legal_area);
  const summary = normalizeText(item.summary);
  const decisionDate = normalizeText(item.decision_date);
  const caseType = normalizeText(item.case_type);
  const caseSubtype = normalizeText(item.case_subtype);
  const basisType = normalizeText(item.basis_type);
  const basis = normalizeText(item.basis);
  const articles = normalizeText(item.articles);
  const tagLabel = basis || basisType || caseType || legalArea || "";

  return {
    recordKey: item.record_key,
    id: item.id,
    court,
    judge,
    legalArea,
    summary,
    decisionDate,
    decisionTimestamp: toTimestamp(decisionDate),
    status: normalizeStatus(item.case_status),
    caseType,
    caseSubtype,
    basisType,
    basis,
    articles,
    caseCost: item.case_cost ?? null,
    totalCaseCost: item.total_case_cost ?? null,
    downloadLink: normalizeText(item.download_link),
    tagLabel,
  };
};

export default function CasesPage() {
  const { t } = useI18n();
  const [cases, setCases] = useState<CaseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [judgeFilter, setJudgeFilter] = useState("");
  const [legalAreaFilter, setLegalAreaFilter] = useState("");
  const [caseTypeFilter, setCaseTypeFilter] = useState("");
  const [caseSubtypeFilter, setCaseSubtypeFilter] = useState("");
  const [basisTypeFilter, setBasisTypeFilter] = useState("");
  const [basisFilter, setBasisFilter] = useState("");
  const [articleFilter, setArticleFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [caseCostMin, setCaseCostMin] = useState("");
  const [caseCostMax, setCaseCostMax] = useState("");
  const [totalCaseCostMin, setTotalCaseCostMin] = useState("");
  const [totalCaseCostMax, setTotalCaseCostMax] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);
  const [page, setPage] = useState(1);

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

  const legalAreaOptions = useMemo(() => uniqueSortedValues(cases.map((item) => item.legalArea)), [cases]);
  const caseTypeOptions = useMemo(() => uniqueSortedValues(cases.map((item) => item.caseType)), [cases]);
  const caseSubtypeOptions = useMemo(() => uniqueSortedValues(cases.map((item) => item.caseSubtype)), [cases]);
  const basisTypeOptions = useMemo(() => uniqueSortedValues(cases.map((item) => item.basisType)), [cases]);
  const basisOptions = useMemo(() => uniqueSortedValues(cases.map((item) => item.basis)), [cases]);
  const articleOptions = useMemo(() => uniqueSortedValues(cases.map((item) => item.articles)), [cases]);

  useEffect(() => {
    setPage(1);
  }, [
    articleFilter,
    basisFilter,
    basisTypeFilter,
    caseCostMax,
    caseCostMin,
    caseSubtypeFilter,
    caseTypeFilter,
    dateFrom,
    dateTo,
    judgeFilter,
    legalAreaFilter,
    pageSize,
    sortBy,
    totalCaseCostMax,
    totalCaseCostMin,
  ]);

  const filteredCases = useMemo(() => {
    const fromTimestamp = dateFrom ? Date.parse(dateFrom) : null;
    const toTimestampValue = dateTo ? Date.parse(dateTo) : null;
    const caseCostMinValue = parseNumberFilter(caseCostMin);
    const caseCostMaxValue = parseNumberFilter(caseCostMax);
    const totalCaseCostMinValue = parseNumberFilter(totalCaseCostMin);
    const totalCaseCostMaxValue = parseNumberFilter(totalCaseCostMax);

    const next = cases.filter((item) => {
      if (!matchesTextFilter(item.judge, judgeFilter)) return false;
      if (!matchesTextFilter(item.legalArea, legalAreaFilter)) return false;
      if (!matchesTextFilter(item.caseType, caseTypeFilter)) return false;
      if (!matchesTextFilter(item.caseSubtype, caseSubtypeFilter)) return false;
      if (!matchesTextFilter(item.basisType, basisTypeFilter)) return false;
      if (!matchesTextFilter(item.basis, basisFilter)) return false;
      if (!matchesTextFilter(item.articles, articleFilter)) return false;

      if (fromTimestamp !== null && !Number.isNaN(fromTimestamp) && item.decisionTimestamp < fromTimestamp) {
        return false;
      }

      if (toTimestampValue !== null && !Number.isNaN(toTimestampValue) && item.decisionTimestamp > toTimestampValue) {
        return false;
      }

      if (!matchesNumericRange(item.caseCost, caseCostMinValue, caseCostMaxValue)) {
        return false;
      }

      if (!matchesNumericRange(item.totalCaseCost, totalCaseCostMinValue, totalCaseCostMaxValue)) {
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
  }, [
    articleFilter,
    basisFilter,
    basisTypeFilter,
    caseCostMax,
    caseCostMin,
    cases,
    caseSubtypeFilter,
    caseTypeFilter,
    dateFrom,
    dateTo,
    judgeFilter,
    legalAreaFilter,
    sortBy,
    totalCaseCostMax,
    totalCaseCostMin,
  ]);

  const activeFilterCount = [
    judgeFilter,
    legalAreaFilter,
    caseTypeFilter,
    caseSubtypeFilter,
    basisTypeFilter,
    basisFilter,
    articleFilter,
    dateFrom,
    dateTo,
    caseCostMin,
    caseCostMax,
    totalCaseCostMin,
    totalCaseCostMax,
  ].filter((value) => value.trim() !== "").length;

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const currentPage = clampPage(page, totalPages);
  const pageWindow = buildPageWindow(currentPage, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = Math.min(currentPage * pageSize, filteredCases.length);
  const paginatedCases = filteredCases.slice(pageStart, pageEnd);

  const notProvidedLabel = t("case_detail_not_provided");

  const getStatusLabel = (status: string) => {
    if (status === "Active") return t("status_active");
    if (status === "Closed") return t("status_closed");
    if (status === "Inactive") return t("status_inactive");
    return t("status_unknown");
  };

  const resetFilters = () => {
    setJudgeFilter("");
    setLegalAreaFilter("");
    setCaseTypeFilter("");
    setCaseSubtypeFilter("");
    setBasisTypeFilter("");
    setBasisFilter("");
    setArticleFilter("");
    setDateFrom("");
    setDateTo("");
    setCaseCostMin("");
    setCaseCostMax("");
    setTotalCaseCostMin("");
    setTotalCaseCostMax("");
    setSortBy("recent");
    setPageSize(10);
    setPage(1);
  };

  return (
    <main className="data-page directory-page-shell case-search-page-shell">
      <DataSectionHeader title={t("data_tab_cases")} variant="cases" />

      <section className="case-search-section">
        <div className="container case-search-layout">
          <aside className="case-search-sidebar">
            <div className="case-search-sidebar-header">
              <div>
                <h2 className="case-search-sidebar-title">{t("case_directory_search_criteria")}</h2>
                <p className="case-search-sidebar-note">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} ${t("case_directory_filters_active")}`
                    : t("case_directory_matching_records")}
                </p>
              </div>
              <button
                className={`case-search-sidebar-toggle${filtersExpanded ? " expanded" : ""}`}
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
              <div className="case-search-sidebar-body">
                <div className="directory-filter-stack case-search-filter-stack">
                <label className="directory-field">
                    <span>{t("case_detail_judge")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      placeholder={t("case_directory_judge_placeholder")}
                      value={judgeFilter}
                      onChange={(event) => setJudgeFilter(event.target.value)}
                    />
                </label>

                  <label className="directory-field">
                    <span>{t("case_detail_legal_area")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      list="cases-legal-area-options"
                      placeholder={t("case_detail_legal_area")}
                      value={legalAreaFilter}
                      onChange={(event) => setLegalAreaFilter(event.target.value)}
                    />
                  </label>
                  <datalist id="cases-legal-area-options">
                    {legalAreaOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>

                  <label className="directory-field">
                    <span>{t("case_detail_case_type")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      list="cases-type-options"
                      placeholder={t("case_detail_case_type")}
                      value={caseTypeFilter}
                      onChange={(event) => setCaseTypeFilter(event.target.value)}
                    />
                  </label>
                  <datalist id="cases-type-options">
                    {caseTypeOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>

                  <label className="directory-field">
                    <span>{t("case_detail_case_subtype")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      list="cases-subtype-options"
                      placeholder={t("case_detail_case_subtype")}
                      value={caseSubtypeFilter}
                      onChange={(event) => setCaseSubtypeFilter(event.target.value)}
                    />
                  </label>
                  <datalist id="cases-subtype-options">
                    {caseSubtypeOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>

                  <label className="directory-field">
                    <span>{t("case_detail_basis_type")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      list="cases-basis-type-options"
                      placeholder={t("case_detail_basis_type")}
                      value={basisTypeFilter}
                      onChange={(event) => setBasisTypeFilter(event.target.value)}
                    />
                  </label>
                  <datalist id="cases-basis-type-options">
                    {basisTypeOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>

                  <label className="directory-field">
                    <span>{t("case_detail_basis")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      list="cases-basis-options"
                      placeholder={t("case_detail_basis")}
                      value={basisFilter}
                      onChange={(event) => setBasisFilter(event.target.value)}
                    />
                  </label>
                  <datalist id="cases-basis-options">
                    {basisOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>

                  <label className="directory-field">
                    <span>{t("case_detail_articles")}</span>
                    <input
                      className="directory-field-input"
                      type="text"
                      list="cases-article-options"
                      placeholder={t("case_detail_articles")}
                      value={articleFilter}
                      onChange={(event) => setArticleFilter(event.target.value)}
                    />
                  </label>
                  <datalist id="cases-article-options">
                    {articleOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>

                  <div className="directory-field">
                    <span>{t("case_detail_decision_date")}</span>
                    <div className="directory-range-grid">
                      <input
                        className="directory-field-input"
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                      />
                      <input
                        className="directory-field-input"
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                      />
                    </div>
                  </div>

                </div>

                <button className="directory-subtle-btn case-search-reset-btn" type="button" onClick={resetFilters}>
                  {t("case_directory_reset")}
                </button>
              </div>
            ) : null}
          </aside>

          <div className="case-search-results">
           
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
            ) : filteredCases.length === 0 ? (
              <div className="directory-feedback-card">
                <h3>{t("case_directory_empty_title")}</h3>
                <p>{t("case_directory_empty_desc")}</p>
              </div>
            ) : (
              <>
                <div className="case-search-list">
                  {paginatedCases.map((item) => {
                    const detailHref = `/data/cases/${encodeURIComponent(item.recordKey)}`;
                    const primaryMeta = item.legalArea || item.caseType || notProvidedLabel;

                    return (
                      <article className="case-result-card" key={item.recordKey}>
                        <div className="case-result-thumb" aria-hidden="true">
                          <div className="case-result-thumb-sheet">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>

                        <div className="case-result-main">
                          <Link className="case-result-title" to={detailHref}>
                            {item.id}
                          </Link>

                          <p className="case-result-subtitle">
                            <span>{item.court || notProvidedLabel}</span>
                            <span aria-hidden="true">{">"}</span>
                            <span>{primaryMeta}</span>
                          </p>

                          <p className="case-result-summary">
                            {truncateText(item.summary || notProvidedLabel, 250)}
                          </p>

                        
                        </div>

                        <div className="case-result-side">
                        

                          <div className="case-result-side-block">
                            <span className="case-result-side-label">{t("case_detail_judge")}</span>
                            <span className="case-result-side-value accent">{item.judge || notProvidedLabel}</span>
                          </div>

                          <div className="case-result-side-block">
                            <span className="case-result-side-label">{t("case_detail_decision_date")}</span>
                            <span className="case-result-side-value">
                              {formatDisplayDate(item.decisionDate) || notProvidedLabel}
                            </span>
                          </div>

                        

                          <span className={`case-result-status ${item.status.toLowerCase()}`}>{getStatusLabel(item.status)}</span>
                        </div>
                      </article>
                    );
                  })}
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
