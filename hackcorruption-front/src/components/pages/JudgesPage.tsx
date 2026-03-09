import { Link, NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { listJudges } from "../../services/judgesService";
import type { Judge } from "../../services/judgesService";
import judgePlaceholder from "../../assets/judge_placeholder.png";

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

type JudgeCard = {
  id: string;
  name: string;
  role: string;
  court: string;
  electedOn: string;
  yearOfElection: string;
  area: string;
  photo: string;
};

const mapApiJudgeToCard = (judge: Judge): JudgeCard => {
  const yearLabel = judge.year_of_election ? String(judge.year_of_election) : "Unknown";
  return {
    id: String(judge.id),
    name: judge.full_name,
    role: "Judge",
    court: judge.area_of_work ?? "Not specified",
    electedOn: yearLabel,
    yearOfElection: yearLabel,
    area: judge.area_of_work ?? "Not specified",
    photo: judge.photoUrl ?? judgePlaceholder,
  };
};

export default function JudgesPage() {
  const [apiJudges, setApiJudges] = useState<JudgeCard[]>([]);
  const [search, setSearch] = useState("");
  const [judgeFilter, setJudgeFilter] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  useEffect(() => {
    let mounted = true;
    listJudges()
      .then((data) => {
        if (!mounted) return;
        setApiJudges(data.map(mapApiJudgeToCard));
      })
      .catch((err) => {
        console.warn(err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredJudges = useMemo(() => {
    const query = search.trim().toLowerCase();
    const judgeQuery = judgeFilter.trim().toLowerCase();
    const courtQuery = courtFilter.trim().toLowerCase();
    const areaQuery = areaFilter.trim().toLowerCase();
    const fromYear = Number(yearFrom);
    const toYear = Number(yearTo);
    const hasFrom = yearFrom.trim() !== "" && Number.isFinite(fromYear);
    const hasTo = yearTo.trim() !== "" && Number.isFinite(toYear);

    return apiJudges.filter((judge) => {
      const name = judge.name.toLowerCase();
      const court = judge.court.toLowerCase();
      const area = judge.area.toLowerCase();
      const yearValue = Number(judge.yearOfElection);

      if (query) {
        const matchesQuery =
          name.includes(query) || court.includes(query) || area.includes(query);
        if (!matchesQuery) return false;
      }
      if (judgeQuery && !name.includes(judgeQuery)) return false;
      if (courtQuery && !court.includes(courtQuery)) return false;
      if (areaQuery && !area.includes(areaQuery)) return false;
      if (hasFrom && (!Number.isFinite(yearValue) || yearValue < fromYear)) return false;
      if (hasTo && (!Number.isFinite(yearValue) || yearValue > toYear)) return false;
      return true;
    });
  }, [apiJudges, search, judgeFilter, courtFilter, areaFilter, yearFrom, yearTo]);

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
              placeholder="Search judges..."
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
            <p className="results-count">{filteredJudges.length} results</p>
          </div>
        </div>
      </section>

      <div className="container search-layout" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <aside className="sidebar">
          <div className="filter-group">
            <div className="filter-header">
              <span>Search Criteria</span>
              <span className="arrow-up">^</span>
            </div>
            <div className="filter-content">
              <div className="criteria-field">
                <label className="criteria-label">Judge</label>
                <input
                  className="criteria-input"
                  type="text"
                  placeholder="Enter name..."
                  value={judgeFilter}
                  onChange={(e) => setJudgeFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label">Court</label>
                <input
                  className="criteria-input"
                  type="text"
                  placeholder="Enter court name..."
                  value={courtFilter}
                  onChange={(e) => setCourtFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label">Legal Area</label>
                <input
                  className="criteria-input"
                  type="text"
                  placeholder="e.g. Criminal Area"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label">Year of Election</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    className="criteria-input"
                    type="number"
                    placeholder="2010"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                  />
                  <input
                    className="criteria-input"
                    type="number"
                    placeholder="Today"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="results-list">
          <div className="judges-grid">
            {filteredJudges.map((judge) => (
              <div className="judge-card" key={judge.id}>
                <div
                  className="judge-card-image"
                  style={{ backgroundImage: `url(${judge.photo})` }}
                />
                <div className="judge-card-name">{judge.name}</div>
                <div className="judge-card-title">{judge.role}</div>
                <div className="judge-card-court">{judge.court}</div>
                <div className="judge-card-meta">
                  <div className="judge-card-line">
                    <span className="judge-card-label">Elected:</span> {judge.electedOn}
                  </div>
                  <div className="judge-card-line">
                    <span className="judge-card-label">Area:</span> {judge.area}
                  </div>
                </div>
                <Link className="download-link" to={`/data/judges/${encodeURIComponent(judge.id)}`}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
