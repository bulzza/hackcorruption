import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CaseForm from "../cases/CaseForm";
import { getCaseById, listCases, updateCase } from "../../services/casesService";
import type { CaseDetail, CaseInput } from "../../services/casesService";

export default function DashboardCaseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState<CaseDetail | null>(null);
  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setCaseItem(null);
      setLoading(false);
      return;
    }
    Promise.all([getCaseById(id), listCases()])
      .then(([detail, list]) => {
        if (!mounted) return;
        setCaseItem(detail ?? null);
        setExistingIds(list.map((item) => item.id));
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

  if (!caseItem) {
    return (
      <div className="admin-empty-state">
        <h2>Case not found</h2>
        <p>The case you are trying to edit does not exist.</p>
        <Link className="admin-btn primary" to="/dashboard/cases">
          Back to Cases
        </Link>
      </div>
    );
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
        <Link to={`/dashboard/cases/${encodeURIComponent(caseItem.id)}`}>{caseItem.id}</Link>
        <span aria-hidden="true">/</span>
        <span>Edit</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Case</h1>
          <p className="admin-page-subtitle">Update case details, insights, and timeline.</p>
        </div>
      </div>

      <CaseForm
        mode="edit"
        initialData={caseItem}
        existingIds={existingIds}
        onSave={async (payload) => {
          const updated = await updateCase(caseItem.id, normalizePayload(payload));
          setCaseItem(updated);
          setExistingIds((prev) => {
            const filtered = prev.filter((item) => item !== caseItem.id);
            return filtered.includes(updated.id) ? filtered : [...filtered, updated.id];
          });
          navigate(`/dashboard/cases/${encodeURIComponent(updated.id)}`);
        }}
        onCancel={() => navigate(`/dashboard/cases/${encodeURIComponent(caseItem.id)}`)}
      />
    </div>
  );
}
