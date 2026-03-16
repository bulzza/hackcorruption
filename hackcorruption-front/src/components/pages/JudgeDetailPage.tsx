import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCaseById } from "../../data/cases";
import { getJudgeById as getApiJudgeById } from "../../services/judgesService";
import type { JudgeDetail } from "../../services/judgesService";
import judgePlaceholder from "../../assets/judge_placeholder.png";

type NormalizedCaseStatus = "Unknown" | "Active" | "Closed";

type NormalizedMetric = {
  label: string;
  value: string;
  tone?: "good" | "warn" | "bad";
  info?: string;
};

type NormalizedCase = {
  id: string;
  court: string;
  type: string;
  subtype: string;
  basisType: string;
  filingDate: string;
  status: NormalizedCaseStatus;
};

type NormalizedJudge = {
  id: string;
  name: string;
  role: string;
  yearOfElection: string;
  area: string;
  photo: string;
  education: string[];
  experience: string[];
  metrics: NormalizedMetric[];
  cases: NormalizedCase[];
};

const DEFAULT_EDUCATION = [
  "Faculty of Law, Justinianus Primus - Skopje (2005)",
  "Academy for Judges and Public Prosecutors (2008)",
];

const DEFAULT_EXPERIENCE = [
  "Basic Criminal Court Skopje (2015 - Present)",
  "Professional Associate, Basic Court Skopje 1 (2010 - 2015)",
];

const DEFAULT_METRICS: NormalizedMetric[] = [
  {
    label: "Average Duration",
    value: "245 days",
    tone: "good",
    info: "Average time from filing to decision.",
  },
  {
    label: "Clearance Rate",
    value: "88%",
    tone: "good",
    info: "Resolved cases vs. incoming in the last year.",
  },
  { label: "Total Solved (2024)", value: "142" },
  { label: "Active Cases", value: "35" },
  { label: "Sentence Severity", value: "Medium", tone: "warn" },
  { label: "Appeal Reversal", value: "15%", tone: "warn" },
];

const normalizeCaseStatus = (status: string | null | undefined): NormalizedCaseStatus => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "closed") return "Closed";
  return "Unknown";
};

const formatEducation = (item: JudgeDetail["education"][number]) => {
  const parts = [item.institution, item.location].filter(Boolean);
  const base = parts.join(", ");
  return item.year ? `${base} (${item.year})` : base || "Education";
};

const formatExperience = (item: JudgeDetail["experience"][number]) => {
  const role = [item.title, item.position].filter(Boolean).join(" - ");
  const start = item.start_year ? String(item.start_year) : "";
  const end = item.is_current ? "Present" : item.end_year ? String(item.end_year) : "";
  const range = start || end ? ` (${start}${start && end ? " - " : ""}${end})` : "";
  return `${role || "Experience"}${range}`;
};

const normalizeApiJudge = (judge: JudgeDetail): NormalizedJudge => {
  const yearLabel = judge.year_of_election ? String(judge.year_of_election) : "Unknown";
  const apiMetricValues = [
    judge.metrics.avg_duration_days,
    judge.metrics.clearance_rate_percent,
    judge.metrics.total_solved,
    judge.metrics.active_cases,
    judge.metrics.sentence_severity,
    judge.metrics.appeal_reversal_percent,
  ];
  const hasMetrics = apiMetricValues.some((value) => Number(value) !== 0);
  const metrics = hasMetrics
    ? [
      { label: "Average Duration", value: `${judge.metrics.avg_duration_days} days` },
      { label: "Clearance Rate", value: `${judge.metrics.clearance_rate_percent}%` },
      { label: "Total Solved", value: String(judge.metrics.total_solved) },
      { label: "Active Cases", value: String(judge.metrics.active_cases) },
      { label: "Sentence Severity", value: String(judge.metrics.sentence_severity) },
      { label: "Appeal Reversal", value: `${judge.metrics.appeal_reversal_percent}%` },
    ]
    : DEFAULT_METRICS;
  const cases = judge.cases.map((item) => ({
    id: item.case_id ?? "",
    court: item.court ?? "",
    type: item.type ?? "",
    subtype: item.subtype ?? "",
    basisType: item.basis_type ?? "",
    filingDate: item.filing_date ?? "",
    status: normalizeCaseStatus(item.status),
  }));
  const education = judge.education
    .map(formatEducation)
    .filter((item) => item.trim() !== "" && item !== "Education");
  const experience = judge.experience
    .map(formatExperience)
    .filter((item) => item.trim() !== "" && item !== "Experience");
  return {
    id: String(judge.id),
    name: judge.full_name,
    role: "Judge",
    yearOfElection: yearLabel,
    area: judge.area_of_work ?? "Not specified",
    photo: judge.photoUrl ?? judgePlaceholder,
    education: education.length > 0 ? education : DEFAULT_EDUCATION,
    experience: experience.length > 0 ? experience : DEFAULT_EXPERIENCE,
    metrics,
    cases,
  };
};

export default function JudgeDetailPage() {
  const { judgeId } = useParams();
  const decodedId = decodeURIComponent(judgeId ?? "");
  const [judge, setJudge] = useState<NormalizedJudge | null>(null);
  const [fetchState, setFetchState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    let mounted = true;
    if (!decodedId) {
      setJudge(null);
      setFetchState("done");
      return () => {
        mounted = false;
      };
    }
    const numericId = Number(decodedId);
    if (!Number.isFinite(numericId)) {
      setJudge(null);
      setFetchState("done");
      return () => {
        mounted = false;
      };
    }
    setFetchState("loading");
    getApiJudgeById(numericId)
      .then((data) => {
        if (!mounted) return;
        setJudge(data ? normalizeApiJudge(data) : null);
        setFetchState("done");
      })
      .catch((err) => {
        console.warn(err);
        if (!mounted) return;
        setJudge(null);
        setFetchState("done");
      });
    return () => {
      mounted = false;
    };
  }, [decodedId]);

  if (!judge && fetchState === "loading") {
    return (
      <main className="data-page">
        <div className="container" style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
          <h1 className="section-title large">Loading judge...</h1>
        </div>
      </main>
    );
  }

  if (!judge) {
    return (
      <main className="data-page">
        <div className="container" style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
          <h1 className="section-title large">Judge not found</h1>
          <Link
            to="/data/judges"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            ƒÅ? Back to Judges
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="judge-profile-main">
      <div className="container" style={{ paddingTop: "7rem",fontSize: "2rem" }}>
        <Link className="judge-back-link" to="/data/judges">
          &larr; Back to Judges
        </Link>
      </div>

      <section className="judge-header-section" style={{ marginTop: "0", paddingTop: "0.5rem" }}>
        <div className="container judge-profile-grid">
          <div className="judge-info">
            <h1>{judge.name}</h1>
            <div className="judge-role">{judge.role}</div>

            <div className="judge-detail-row">
              <span className="judge-label">Name and Surname:</span>
              <span className="judge-value">{judge.name}</span>
            </div>
            <div className="judge-detail-row">
              <span className="judge-label">Year of Election:</span>
              <span className="judge-value">{judge.yearOfElection}</span>
            </div>
            <div className="judge-detail-row">
              <span className="judge-label">Area of Work:</span>
              <span className="judge-value">{judge.area}</span>
            </div>

            <div className="judge-bio-section">
              <div className="judge-bio-title">Education</div>
              <ul className="judge-bio-list">
                {judge.education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="judge-bio-section">
              <div className="judge-bio-title">Work Experience</div>
              <ul className="judge-bio-list">
                {judge.experience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="judge-photo" style={{ backgroundImage: `url(${judge.photo})`, height: 200, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 6 }} />
        </div>
      </section>


      <div className="container">
        <section className="judge-kpi-section">
          <div className="kpi-grid">
            {judge.metrics.map((metric) => (
              <div className="kpi-card" key={metric.label}>
                <span className={`kpi-value${metric.tone ? ` ${metric.tone}` : ""}`}>
                  {metric.value}
                </span>
                <span className="kpi-label">
                  {metric.label}
                  {metric.info && (
                    <span className="kpi-info-icon">
                      ?
                      <span className="kpi-tooltip">{metric.info}</span>
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="judge-cases-section">
          <div className="section-label">Cases</div>
          <div className="cases-table-wrapper">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Court</th>
                  <th>Type</th>
                  <th>Subtype</th>
                  <th>Basis Type</th>
                  <th>Filing Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {judge.cases.map((item) => {
                  const statusClass =
                    item.status === "Active"
                      ? "status-active"
                      : item.status === "Closed"
                        ? "status-closed"
                        : "status-unknown";
                  const hasCase = Boolean(getCaseById(item.id));

                  return (
                    <tr key={`${judge.id}-${item.id}`}>
                      <td>
                        {hasCase ? (
                          <Link
                            className="meta-value-link"
                            to={`/data/cases/${encodeURIComponent(item.id)}`}
                          >
                            {item.id}
                          </Link>
                        ) : (
                          <span className="meta-value-link">{item.id}</span>
                        )}
                      </td>
                      <td>{item.court}</td>
                      <td>{item.type}</td>
                      <td>{item.subtype}</td>
                      <td>{item.basisType}</td>
                      <td>{item.filingDate}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>{item.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
