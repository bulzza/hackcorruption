import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import JudgeForm from "../judges/JudgeForm";
import { getJudgeById, listJudges, updateJudge } from "../../services/judgesService";
import type { JudgeDetail, JudgeInput } from "../../services/judgesService";

export default function DashboardJudgeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [judge, setJudge] = useState<JudgeDetail | null>(null);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setJudge(null);
      setLoading(false);
      return;
    }
    Promise.all([getJudgeById(numericId), listJudges()])
      .then(([detail, list]) => {
        if (!mounted) return;
        setJudge(detail ?? null);
        setExistingSlugs(list.map((item) => item.slug));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="admin-loading">Loading form...</div>;
  }

  if (!judge) {
    return (
      <div className="admin-empty-state">
        <h2>Judge not found</h2>
        <p>The judge you are trying to edit does not exist.</p>
        <Link className="admin-btn primary" to="/dashboard/judges">
          Back to Judges
        </Link>
      </div>
    );
  }

  const toNumber = (value: number | string | null | undefined, fallback = 0) => {
    if (value === null || value === undefined || value === "") return fallback;
    const numeric = Number(String(value).replace(/%/g, ""));
    return Number.isNaN(numeric) ? fallback : numeric;
  };

  const toNullableNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === "") return null;
    const numeric = Number(String(value).replace(/%/g, ""));
    return Number.isNaN(numeric) ? null : numeric;
  };

  const normalizePayload = (payload: JudgeInput): JudgeInput => ({
    ...payload,
    year_of_election: toNullableNumber(payload.year_of_election),
    education: payload.education.map((item) => ({
      ...item,
      year: toNullableNumber(item.year),
    })),
    experience: payload.experience.map((item) => ({
      ...item,
      start_year: toNullableNumber(item.start_year),
      end_year: item.is_current ? null : toNullableNumber(item.end_year),
    })),
    metrics: {
      avg_duration_days: toNumber(payload.metrics.avg_duration_days, 0),
      clearance_rate_percent: toNumber(payload.metrics.clearance_rate_percent, 0),
      total_solved: toNumber(payload.metrics.total_solved, 0),
      active_cases: toNumber(payload.metrics.active_cases, 0),
      sentence_severity: toNumber(payload.metrics.sentence_severity, 0),
      appeal_reversal_percent: toNumber(payload.metrics.appeal_reversal_percent, 0),
    },
    cases: payload.cases.map((item) => ({
      ...item,
      filing_date: item.filing_date,
    })),
  });

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard/judges">Judges</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/dashboard/judges/${judge.id}`}>{judge.full_name}</Link>
        <span aria-hidden="true">/</span>
        <span>Edit</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Judge</h1>
          <p className="admin-page-subtitle">Update judge details and metrics.</p>
        </div>
      </div>

      <JudgeForm
        mode="edit"
        initialData={judge}
        existingSlugs={existingSlugs}
        onSave={async (payload, photoFile) => {
          const updated = await updateJudge(judge.id, normalizePayload(payload), photoFile);
          setJudge(updated);
          setExistingSlugs((prev) => {
            const filtered = prev.filter((slug) => slug !== judge.slug);
            return filtered.includes(updated.slug) ? filtered : [...filtered, updated.slug];
          });
          navigate(`/dashboard/judges/${updated.id}`);
        }}
        onCancel={() => navigate(`/dashboard/judges/${judge.id}`)}
      />
    </div>
  );
}
