import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import JudgeForm from "../judges/JudgeForm";
import { createJudge, listJudges } from "../../services/judgesService";
import type { JudgeInput } from "../../services/judgesService";

export default function DashboardJudgeCreate() {
  const navigate = useNavigate();
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listJudges()
      .then((data) => {
        if (!mounted) return;
        setExistingSlugs(data.map((judge) => judge.slug));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading form...</div>;
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
        <span>Add Judge</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Add Judge</h1>
          <p className="admin-page-subtitle">Create a new judge record for the admin registry.</p>
        </div>
      </div>

      <JudgeForm
        mode="create"
        existingSlugs={existingSlugs}
        onSave={async (payload, photoFile) => {
          const created = await createJudge(normalizePayload(payload), photoFile);
          setExistingSlugs((prev) =>
            prev.includes(created.slug) ? prev : [...prev, created.slug]
          );
          navigate(`/dashboard/judges/${created.id}`);
        }}
        onCancel={() => navigate("/dashboard/judges")}
      />
    </div>
  );
}
