import { Link, NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import { CASES } from "../../data/cases";

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [judgeFilter, setJudgeFilter] = useState("");
  const [legalAreaFilter, setLegalAreaFilter] = useState("");
  const [caseTypeFilter, setCaseTypeFilter] = useState("");
  const [caseSubtypeFilter, setCaseSubtypeFilter] = useState("");
  const [basisTypeFilter, setBasisTypeFilter] = useState("");
  const [basisFilter, setBasisFilter] = useState("");
  const [articleFilter, setArticleFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [costMin, setCostMin] = useState("");
  const [costMax, setCostMax] = useState("");
  const [totalCostMin, setTotalCostMin] = useState("");
  const [totalCostMax, setTotalCostMax] = useState("");
  const [mitigatingFilter, setMitigatingFilter] = useState("");
  const [pleaFilter, setPleaFilter] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [durationMax, setDurationMax] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [appealFilter, setAppealFilter] = useState("");

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();
    const judgeQuery = judgeFilter.trim().toLowerCase();
    const legalAreaQuery = legalAreaFilter.trim().toLowerCase();
    const caseTypeQuery = caseTypeFilter.trim().toLowerCase();
    const caseSubtypeQuery = caseSubtypeFilter.trim().toLowerCase();
    const basisTypeQuery = basisTypeFilter.trim().toLowerCase();
    const basisQuery = basisFilter.trim().toLowerCase();
    const articleQuery = articleFilter.trim().toLowerCase();
    const mitigatingQuery = mitigatingFilter.trim().toLowerCase();
    const pleaQuery = pleaFilter.trim().toLowerCase();
    const severityQuery = severityFilter.trim().toLowerCase();
    const appealQuery = appealFilter.trim().toLowerCase();
    const fromDate = dateFrom ? Date.parse(dateFrom) : null;
    const toDate = dateTo ? Date.parse(dateTo) : null;
    const minCost = costMin.trim() === "" ? null : Number(costMin);
    const maxCost = costMax.trim() === "" ? null : Number(costMax);
    const minTotalCost = totalCostMin.trim() === "" ? null : Number(totalCostMin);
    const maxTotalCost = totalCostMax.trim() === "" ? null : Number(totalCostMax);
    const minDuration = durationMin.trim() === "" ? null : Number(durationMin);
    const maxDuration = durationMax.trim() === "" ? null : Number(durationMax);

    return CASES.filter((c) => {
      const summary = c.summary.toLowerCase();
      const tags = (c.tags ?? []).map((tag) => tag.toLowerCase());
      const tagsText = tags.join(" ");
      const caseType = c.caseType.toLowerCase();
      const legalArea = c.legalArea.toLowerCase();
      const judge = c.judge.toLowerCase();
      const court = c.court.toLowerCase();

      if (query) {
        const matchesQuery =
          c.id.toLowerCase().includes(query) ||
          summary.includes(query) ||
          judge.includes(query) ||
          court.includes(query) ||
          legalArea.includes(query) ||
          caseType.includes(query) ||
          tagsText.includes(query);
        if (!matchesQuery) return false;
      }
      if (judgeQuery && !judge.includes(judgeQuery)) return false;
      if (legalAreaQuery && !legalArea.includes(legalAreaQuery)) return false;
      if (caseTypeQuery && !caseType.includes(caseTypeQuery)) return false;
      if (
        caseSubtypeQuery &&
        !(
          caseType.includes(caseSubtypeQuery) ||
          summary.includes(caseSubtypeQuery) ||
          tagsText.includes(caseSubtypeQuery)
        )
      ) {
        return false;
      }
      if (
        basisTypeQuery &&
        !(summary.includes(basisTypeQuery) || tagsText.includes(basisTypeQuery))
      ) {
        return false;
      }
      if (basisQuery && !(summary.includes(basisQuery) || tagsText.includes(basisQuery))) {
        return false;
      }
      if (articleQuery && !summary.includes(articleQuery)) return false;

      const caseDate = Date.parse(c.decisionDate);
      if (fromDate !== null && !Number.isNaN(fromDate) && caseDate < fromDate) return false;
      if (toDate !== null && !Number.isNaN(toDate) && caseDate > toDate) return false;

      if (minCost !== null && Number.isFinite(minCost) && c.costEUR < minCost) return false;
      if (maxCost !== null && Number.isFinite(maxCost) && c.costEUR > maxCost) return false;
      if (minTotalCost !== null && Number.isFinite(minTotalCost) && c.costEUR < minTotalCost) {
        return false;
      }
      if (maxTotalCost !== null && Number.isFinite(maxTotalCost) && c.costEUR > maxTotalCost) {
        return false;
      }
      if (minDuration !== null && Number.isFinite(minDuration) && c.durationDays < minDuration) {
        return false;
      }
      if (maxDuration !== null && Number.isFinite(maxDuration) && c.durationDays > maxDuration) {
        return false;
      }
      if (
        mitigatingQuery &&
        !(summary.includes(mitigatingQuery) || tagsText.includes(mitigatingQuery))
      ) {
        return false;
      }
      if (pleaQuery && !(summary.includes(pleaQuery) || tagsText.includes(pleaQuery))) {
        return false;
      }
      if (
        severityQuery &&
        !c.kpis.complexity.toLowerCase().includes(severityQuery) &&
        !summary.includes(severityQuery)
      ) {
        return false;
      }
      if (appealQuery && !(summary.includes(appealQuery) || tagsText.includes(appealQuery))) {
        return false;
      }

      return true;
    });
  }, [
    search,
    judgeFilter,
    legalAreaFilter,
    caseTypeFilter,
    caseSubtypeFilter,
    basisTypeFilter,
    basisFilter,
    articleFilter,
    dateFrom,
    dateTo,
    costMin,
    costMax,
    totalCostMin,
    totalCostMax,
    mitigatingFilter,
    pleaFilter,
    durationMin,
    durationMax,
    severityFilter,
    appealFilter,
  ]);

  return (
    <main className="data-page">
      <div className="data-tabs">
        <NavLink to="/data/courts" end className={tabClass}>
          Courts
        </NavLink>
        <NavLink to="/data/judges" end className={tabClass}>
          Judges
        </NavLink>
        <NavLink to="/data/cases" end className={tabClass}>
          Cases
        </NavLink>
      </div>

      <section className="search-header-section">
        <div className="container">
          <div className="search-bar-wrapper">
            <span className="search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.134 18 4 14.866 4 11C4 7.134 7.134 4 11 4C14.866 4 18 7.134 18 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="clear-icon"
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              x
            </button>
          </div>
          <div className="results-bar">
            <p className="results-count">{filteredCases.length} results</p>
          </div>
        </div>
      </section>

      <div className="container search-layout" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <aside className="sidebar">
          <div className="filter-group">
            <div className="filter-header">
              <span data-i18n="filter_title">Search Criteria</span>
              <span className="arrow-up">^</span>
            </div>
            <div className="filter-content">
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_judge">
                  Judge
                </label>
                <input
                  type="text"
                  id="filter-judge"
                  className="criteria-input"
                  placeholder="Enter judge name..."
                  data-i18n="placeholder_enter_name"
                  value={judgeFilter}
                  onChange={(e) => setJudgeFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_legal_area">
                  Legal Area
                </label>
                <input
                  type="text"
                  id="filter-legal-area"
                  className="criteria-input"
                  placeholder="e.g. Criminal Area"
                  data-i18n="placeholder_legal_area"
                  value={legalAreaFilter}
                  onChange={(e) => setLegalAreaFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_case_type">
                  Case Type
                </label>
                <input
                  type="text"
                  id="filter-case-type"
                  className="criteria-input"
                  placeholder="e.g. Criminal Adult"
                  data-i18n="placeholder_case_type"
                  value={caseTypeFilter}
                  onChange={(e) => setCaseTypeFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_case_subtype">
                  Case Subtype
                </label>
                <input
                  type="text"
                  id="filter-case-subtype"
                  className="criteria-input"
                  value={caseSubtypeFilter}
                  onChange={(e) => setCaseSubtypeFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_basis_type">
                  Basis Type
                </label>
                <input
                  type="text"
                  id="filter-basis-type"
                  className="criteria-input"
                  value={basisTypeFilter}
                  onChange={(e) => setBasisTypeFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_basis">
                  Basis
                </label>
                <input
                  type="text"
                  id="filter-basis"
                  className="criteria-input"
                  value={basisFilter}
                  onChange={(e) => setBasisFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_article">
                  Article
                </label>
                <input
                  type="text"
                  id="filter-article"
                  className="criteria-input"
                  placeholder="e.g. Art. 297"
                  data-i18n="placeholder_article"
                  value={articleFilter}
                  onChange={(e) => setArticleFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_decision_date">
                  Decision Date
                </label>
                <div className="criteria-range">
                  <input
                    type="date"
                    id="filter-date-from"
                    className="criteria-input"
                    placeholder="From"
                    data-i18n="placeholder_from"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <input
                    type="date"
                    id="filter-date-to"
                    className="criteria-input"
                    placeholder="To"
                    data-i18n="placeholder_to"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_case_cost">
                  Case Cost
                </label>
                <div className="criteria-range">
                  <input
                    type="number"
                    id="filter-cost-min"
                    className="criteria-input"
                    placeholder="Min"
                    data-i18n="placeholder_min"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={costMin}
                    onChange={(e) => setCostMin(e.target.value)}
                  />
                  <input
                    type="number"
                    id="filter-cost-max"
                    className="criteria-input"
                    placeholder="Max"
                    data-i18n="placeholder_max"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={costMax}
                    onChange={(e) => setCostMax(e.target.value)}
                  />
                </div>
              </div>
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_total_cost">
                  Total Case Cost
                </label>
                <div className="criteria-range">
                  <input
                    type="number"
                    id="filter-judgment-min"
                    className="criteria-input"
                    placeholder="Min"
                    data-i18n="placeholder_min"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={totalCostMin}
                    onChange={(e) => setTotalCostMin(e.target.value)}
                  />
                  <input
                    type="number"
                    id="filter-judgment-max"
                    className="criteria-input"
                    placeholder="Max"
                    data-i18n="placeholder_max"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={totalCostMax}
                    onChange={(e) => setTotalCostMax(e.target.value)}
                  />
                </div>
              </div>
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_mitigating">
                  Mitigating Factors
                </label>
                <input
                  type="text"
                  id="filter-mitigating"
                  className="criteria-input"
                  placeholder="e.g. Used"
                  data-i18n="placeholder_mitigating"
                  value={mitigatingFilter}
                  onChange={(e) => setMitigatingFilter(e.target.value)}
                />
              </div>
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_plea">
                  Plea Deal
                </label>
                <input
                  type="text"
                  id="filter-plea"
                  className="criteria-input"
                  placeholder="e.g. Accepted"
                  data-i18n="placeholder_plea"
                  value={pleaFilter}
                  onChange={(e) => setPleaFilter(e.target.value)}
                />
              </div>
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_duration">
                  Duration (Days)
                </label>
                <div className="criteria-range">
                  <input
                    type="number"
                    id="filter-duration-min"
                    className="criteria-input"
                    placeholder="Min"
                    data-i18n="placeholder_min"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                  />
                  <input
                    type="number"
                    id="filter-duration-max"
                    className="criteria-input"
                    placeholder="Max"
                    data-i18n="placeholder_max"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    value={durationMax}
                    onChange={(e) => setDurationMax(e.target.value)}
                  />
                </div>
              </div>
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_severity">
                  Severity
                </label>
                <input
                  type="text"
                  id="filter-severity"
                  className="criteria-input"
                  placeholder="e.g. High"
                  data-i18n="placeholder_severity"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                />
              </div>
              <div className="criteria-field">
                <label className="criteria-label" data-i18n="filter_appeal">
                  Appeal
                </label>
                <input
                  type="text"
                  id="filter-appeal"
                  className="criteria-input"
                  placeholder="e.g. Granted"
                  data-i18n="placeholder_appeal"
                  value={appealFilter}
                  onChange={(e) => setAppealFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="results-list" id="results-container">
          {filteredCases.map((c) => (
            <div className="horizontal-card" key={c.id}>
              <div className="card-left">
                <div className="doc-thumbnail-placeholder">
                  <div className="line l1" />
                  <div className="line l2" />
                  <div className="line l3" />
                </div>
              </div>

              <div className="card-content">
                <Link className="case-id" to={`/data/cases/${encodeURIComponent(c.id)}`}>
                  {c.id}
                </Link>
                <div className="case-breadcrumb">
                  {c.legalArea} / {c.caseType}
                </div>
                <div className="case-snippet">{c.summary}</div>
                <Link className="download-link" to={`/data/cases/${encodeURIComponent(c.id)}`}>
                  View case
                </Link>
              </div>

              <div className="card-right">
                <span className="case-badge">{c.court}</span>

                <div className="meta-group">
                  <div className="meta-label">Judge</div>
                  <div className="meta-value">{c.judge}</div>
                </div>

                <div className="meta-group">
                  <div className="meta-label">Decision</div>
                  <div className="meta-value">{c.decisionDate}</div>
                </div>

               <div className="relevance">
                 <div className="relevance-group"> Relevance: 
                  <div className="relevance-indicator" />
                 <div className="thumbs">👍 👎</div>
                </div>
               </div>
              </div>
            </div>
          ))}
        </div>

        <div
          id="data-pagination"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
            alignItems: "center",
          }}
        />
      </div>
    </main>
  );
}
