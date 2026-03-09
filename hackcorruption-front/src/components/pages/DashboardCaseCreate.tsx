import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CaseForm from "../cases/CaseForm";
import { createCase, listCases } from "../../services/casesService";
import type { CaseInput } from "../../services/casesService";

export default function DashboardCaseCreate() {
  const navigate = useNavigate();
  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listCases()
      .then((data) => {
        if (!mounted) return;
        setExistingIds(data.map((item) => item.id));
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

  const toNullableNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === "") return null;
    const numeric = Number(String(value).replace(/%/g, ""));
    return Number.isNaN(numeric) ? null : numeric;
  };

  const normalizePayload = (payload: CaseInput): CaseInput => ({
    ...payload,
    id: payload.id.trim(),
    court: payload.court.trim(),
    judge: payload.judge.trim(),
    legal_area: payload.legal_area.trim(),
    summary: payload.summary.trim(),
    case_detail: {
      case_type: payload.case_detail.case_type?.trim() || null,
      case_subtype: payload.case_detail.case_subtype?.trim() || null,
      basis_type: payload.case_detail.basis_type?.trim() || null,
      basis: payload.case_detail.basis?.trim() || null,
      articles: payload.case_detail.articles?.trim() || null,
      public_prosecutor_case: payload.case_detail.public_prosecutor_case?.trim() || null,
    },
    case_financials: {
      case_cost: toNullableNumber(payload.case_financials.case_cost),
      total_case_cost: toNullableNumber(payload.case_financials.total_case_cost),
    },
    case_insights: {
      mitigating_factors: payload.case_insights.mitigating_factors?.trim() || null,
      plea_deal: payload.case_insights.plea_deal?.trim() || null,
      duration_days: toNullableNumber(payload.case_insights.duration_days),
      severity_ratio: toNullableNumber(payload.case_insights.severity_ratio),
      sentence_severity: payload.case_insights.sentence_severity?.trim() || null,
      appeal: payload.case_insights.appeal?.trim() || null,
    },
    case_timeline: payload.case_timeline
      .map((item) => ({
        event_name: item.event_name.trim(),
        event_date: item.event_date,
      }))
      .filter((item) => item.event_name || item.event_date),
  });

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard/cases">Cases</Link>
        <span aria-hidden="true">/</span>
        <span>Add Case</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Add Case</h1>
          <p className="admin-page-subtitle">Create a new case record for the registry.</p>
        </div>
      </div>

      <CaseForm
        mode="create"
        existingIds={existingIds}
        onSave={async (payload) => {
          const created = await createCase(normalizePayload(payload));
          setExistingIds((prev) => (prev.includes(created.id) ? prev : [...prev, created.id]));
          navigate(`/dashboard/cases/${encodeURIComponent(created.id)}`);
        }}
        onCancel={() => navigate("/dashboard/cases")}
      />
    </div>
  );
}
