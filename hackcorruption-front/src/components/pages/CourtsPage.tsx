import { Link, NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import { COURTS } from "../../data/courts";

const tabClass = ({ isActive }: { isActive: boolean }) => `tab-btn${isActive ? " active" : ""}`;

export default function CourtsPage() {
  const [search, setSearch] = useState("");
  const [courtName, setCourtName] = useState("");
  const [category, setCategory] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");

  const filteredCourts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const nameQuery = courtName.trim().toLowerCase();
    const categoryQuery = category.trim().toLowerCase();
    const jurisdictionQuery = jurisdiction.trim().toLowerCase();

    return COURTS.filter((court) => {
      const name = court.name.toLowerCase();
      const address = court.address.toLowerCase();
      const tag = court.cardTag.toLowerCase();
      const region = court.jurisdiction.toLowerCase();
      const type = court.type.toLowerCase();

      if (query) {
        const matchesQuery =
          name.includes(query) ||
          address.includes(query) ||
          region.includes(query) ||
          tag.includes(query) ||
          type.includes(query);
        if (!matchesQuery) return false;
      }
      if (nameQuery && !name.includes(nameQuery)) return false;
      if (categoryQuery && !(tag.includes(categoryQuery) || type.includes(categoryQuery))) return false;
      if (jurisdictionQuery && !region.includes(jurisdictionQuery)) return false;
      return true;
    });
  }, [search, courtName, category, jurisdiction]);

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
              placeholder="Search courts..."
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
            <p className="results-count">{filteredCourts.length} results</p>
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
                <label className="criteria-label">Court Name</label>
                <input
                  className="criteria-input"
                  type="text"
                  placeholder="Enter name..."
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label">Category</label>
                <input
                  className="criteria-input"
                  type="text"
                  placeholder="e.g. Basic Court"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="criteria-field">
                <label className="criteria-label">Region/Jurisdiction</label>
                <input
                  className="criteria-input"
                  type="text"
                  placeholder="e.g. Skopje"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="results-list">
          <div className="courts-grid">
            {filteredCourts.map((court) => (
              <div className="court-card" key={court.id}>
                <div className="court-card-tag">{court.cardTag}</div>
                <Link className="court-card-name" to={`/data/courts/${encodeURIComponent(court.id)}`}>
                  {court.name}
                </Link>

                <div className="court-card-row">
                  <span className="court-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <span>{court.address}</span>
                </div>

                <div className="court-card-row">
                  <span className="court-card-icon" aria-hidden="true">
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
                  <span className="court-card-phones">
                    {court.phones.map((phone) => (
                      <span key={phone}>{phone}</span>
                    ))}
                  </span>
                </div>

                <div className="court-card-row">
                  <span className="court-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 20h16M6 6h12M8 6v10M16 6v10M8 10h8M5 6l7-3 7 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{court.jurisdiction}</span>
                </div>

                <a
                  className="court-card-link"
                  href={court.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Website <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
