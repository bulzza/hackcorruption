import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { getCaseById, listCases } from "../../services/casesService";
import type { Case, CaseDetail } from "../../services/casesService";

type NormalizedCaseDetail = {
  id: string;
  court: string;
  judge: string;
  legalArea: string;
  summary: string;
  decisionDate: string;
  status: string;
  caseType: string;
  caseSubtype: string;
  basisType: string;
  basis: string;
  articles: string;
  publicProsecutorCase: string;
  caseCost: string;
  totalCaseCost: string;
  mitigatingFactors: string;
  pleaDeal: string;
  durationDays: string;
  severityRatio: string;
  sentenceSeverity: string;
  appeal: string;
  timeline: Array<{ name: string; date: string }>;
};

type RelatedCaseCard = {
  id: string;
  recordKey: string;
  court: string;
  judge: string;
  decisionDate: string;
  legalArea: string;
};

const normalizeStatus = (value: string | null | undefined) => {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "closed") return "Closed";
  if (normalized === "inactive") return "Inactive";
  return "Unknown";
};

const formatDisplayDate = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return raw;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(parsed));
};

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

const normalizeCaseDetail = (item: CaseDetail): NormalizedCaseDetail => ({
  id: item.id,
  court: item.court?.trim() || "",
  judge: item.judge?.trim() || "",
  legalArea: item.legal_area?.trim() || "",
  summary: item.summary?.trim() || "",
  decisionDate: item.decision_date?.trim() || "",
  status: normalizeStatus(item.case_status),
  caseType: item.case_detail.case_type?.trim() || "",
  caseSubtype: item.case_detail.case_subtype?.trim() || "",
  basisType: item.case_detail.basis_type?.trim() || "",
  basis: item.case_detail.basis?.trim() || "",
  articles: item.case_detail.articles?.trim() || "",
  publicProsecutorCase: item.case_detail.public_prosecutor_case?.trim() || "",
  caseCost: formatCurrency(item.case_financials.case_cost),
  totalCaseCost: formatCurrency(item.case_financials.total_case_cost),
  mitigatingFactors: item.case_insights.mitigating_factors?.trim() || "",
  pleaDeal: item.case_insights.plea_deal?.trim() || "",
  durationDays:
    item.case_insights.duration_days !== null && item.case_insights.duration_days !== undefined
      ? `${item.case_insights.duration_days}`
      : "",
  severityRatio:
    item.case_insights.severity_ratio !== null && item.case_insights.severity_ratio !== undefined
      ? `${item.case_insights.severity_ratio}`
      : "",
  sentenceSeverity: item.case_insights.sentence_severity?.trim() || "",
  appeal: item.case_insights.appeal?.trim() || "",
  timeline: (item.case_timeline ?? []).map((timelineItem) => ({
    name: timelineItem.event_name?.trim() || "",
    date: timelineItem.event_date?.trim() || "",
  })),
});

const mapRelatedCase = (item: Case): RelatedCaseCard => ({
  id: item.id,
  recordKey: item.record_key,
  court: item.court?.trim() || "",
  judge: item.judge?.trim() || "",
  decisionDate: item.decision_date?.trim() || "",
  legalArea: item.legal_area?.trim() || "",
});

export default function CaseDetailPage() {
  const { t } = useI18n();
  const { caseId } = useParams();
  const decodedId = decodeURIComponent(caseId ?? "");
  const [item, setItem] = useState<NormalizedCaseDetail | null>(null);
  const [relatedCases, setRelatedCases] = useState<RelatedCaseCard[]>([]);
  const [loading, setLoading] = useState(decodedId !== "");

  useEffect(() => {
    let mounted = true;

    if (!decodedId) {
      queueMicrotask(() => {
        if (!mounted) return;
        setItem(null);
        setRelatedCases([]);
        setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }

    queueMicrotask(() => {
      if (!mounted) return;
      setLoading(true);
      setItem(null);
      setRelatedCases([]);
    });

    Promise.all([getCaseById(decodedId), listCases()])
      .then(([detail, cases]) => {
        if (!mounted) return;
        const normalized = detail ? normalizeCaseDetail(detail) : null;
        setItem(normalized);

        if (!normalized) {
          setRelatedCases([]);
          return;
        }

        const related = cases
          .map(mapRelatedCase)
          .filter((candidate) => candidate.id !== normalized.id)
          .filter(
            (candidate) =>
              candidate.court === normalized.court ||
              candidate.legalArea === normalized.legalArea ||
              candidate.judge === normalized.judge
          )
          .sort((left, right) => Date.parse(right.decisionDate || "") - Date.parse(left.decisionDate || ""))
          .slice(0, 6);

        setRelatedCases(related);
      })
      .catch((err) => {
        console.warn(err);
        if (!mounted) return;
        setItem(null);
        setRelatedCases([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [decodedId]);

  const getStatusLabel = (status: string) => {
    if (status === "Active") return t("status_active");
    if (status === "Closed") return t("status_closed");
    if (status === "Inactive") return t("status_inactive");
    return t("status_unknown");
  };

  const overviewItems = useMemo(
    () =>
      item
        ? [
            { label: t("case_detail_court"), value: item.court },
            { label: t("case_detail_judge"), value: item.judge },
            { label: t("case_detail_legal_area"), value: item.legalArea },
            { label: t("case_detail_decision_date"), value: formatDisplayDate(item.decisionDate) },
            { label: t("case_detail_case_type"), value: item.caseType },
            { label: t("case_detail_case_subtype"), value: item.caseSubtype },
            { label: t("case_detail_basis_type"), value: item.basisType },
            { label: t("case_detail_basis"), value: item.basis },
            { label: t("case_detail_articles"), value: item.articles },
            { label: t("case_detail_public_prosecutor_case"), value: item.publicProsecutorCase },
          ]
        : [],
    [item, t]
  );

  const insightItems = useMemo(
    () =>
      item
        ? [
            { label: t("case_detail_case_cost"), value: item.caseCost },
            { label: t("case_detail_total_case_cost"), value: item.totalCaseCost },
            { label: t("case_detail_mitigating_factors"), value: item.mitigatingFactors },
            { label: t("case_detail_plea_deal"), value: item.pleaDeal },
            { label: t("case_detail_duration"), value: item.durationDays ? `${item.durationDays} ${t("case_detail_days")}` : "" },
            { label: t("case_detail_severity_ratio"), value: item.severityRatio },
            { label: t("case_detail_sentence_severity"), value: item.sentenceSeverity },
            { label: t("case_detail_appeal"), value: item.appeal },
          ]
        : [],
    [item, t]
  );

  if (loading) {
    return (
      <main className="data-page case-detail-page-shell">
        <div className="container case-detail-state-wrap">
          <div className="case-detail-state-card">
            <h1 className="case-detail-state-title">{t("case_detail_loading")}</h1>
          </div>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="data-page case-detail-page-shell">
        <div className="container case-detail-state-wrap">
          <div className="case-detail-state-card">
            <h1 className="case-detail-state-title">{t("case_detail_not_found")}</h1>
            <Link className="case-detail-backlink" to="/data/cases">
              &larr; {t("case_detail_back")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="data-page case-detail-page-shell">
      <div className="container case-detail-backbar">
        <Link className="case-detail-backlink" to="/data/cases">
          &larr; {t("case_detail_back")}
        </Link>
      </div>

      <section className="case-detail-hero-section">
        <div className="container case-detail-hero">
          <div className="case-detail-hero-main">
            <div className="case-detail-status-row">
              <span className={`case-detail-status ${item.status.toLowerCase()}`}>{getStatusLabel(item.status)}</span>
              <span className="case-detail-date">{formatDisplayDate(item.decisionDate) || t("case_detail_not_provided")}</span>
            </div>
            <h1 className="case-detail-title">{item.id}</h1>
            <p className="case-detail-subtitle">
              <span>{item.court || t("case_detail_not_provided")}</span>
              <span>{item.legalArea || t("case_detail_not_provided")}</span>
            </p>
            <p className="case-detail-summary">{item.summary || t("case_detail_not_provided")}</p>
          </div>

          <div className="case-detail-overview-card">
            <div className="case-detail-overview-head">{t("case_detail_overview")}</div>
            <div className="case-detail-overview-grid">
              {overviewItems.map((entry) => (
                <div className="case-detail-overview-item" key={entry.label}>
                  <span className="case-detail-overview-label">{entry.label}</span>
                  <span className="case-detail-overview-value">{entry.value || t("case_detail_not_provided")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container case-detail-content">
        <section className="case-detail-section">
          <div className="case-detail-section-head">
            <h2 className="case-detail-section-title">{t("case_detail_key_insights")}</h2>
          </div>
          <div className="case-detail-insights-grid">
            {insightItems.map((entry) => (
              <div className="case-detail-insight-card" key={entry.label}>
                <span className="case-detail-insight-label">{entry.label}</span>
                <strong className="case-detail-insight-value">{entry.value || t("case_detail_not_provided")}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="case-detail-section">
          <div className="case-detail-section-head">
            <h2 className="case-detail-section-title">{t("case_detail_timeline")}</h2>
          </div>
          <div className="case-detail-timeline">
            {item.timeline.length === 0 ? (
              <div className="case-detail-empty">{t("case_detail_no_timeline")}</div>
            ) : (
              item.timeline.map((timelineItem, index) => (
                <div className="case-detail-timeline-item" key={`${timelineItem.date}-${index}`}>
                  <div className="case-detail-timeline-date">
                    {formatDisplayDate(timelineItem.date) || t("case_detail_not_provided")}
                  </div>
                  <div className="case-detail-timeline-name">{timelineItem.name || t("case_detail_not_provided")}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="case-detail-section">
          <div className="case-detail-section-head">
            <h2 className="case-detail-section-title">{t("case_detail_related_cases")}</h2>
          </div>
          {relatedCases.length === 0 ? (
            <div className="case-detail-empty">{t("case_detail_no_related_cases")}</div>
          ) : (
            <div className="case-detail-related-grid">
              {relatedCases.map((related) => (
                <article className="case-detail-related-card" key={related.recordKey}>
                  <Link className="case-detail-related-title" to={`/data/cases/${encodeURIComponent(related.id)}`}>
                    {related.id}
                  </Link>
                  <div className="case-detail-related-meta">
                    <span>{related.court || t("case_detail_not_provided")}</span>
                    <span>{related.judge || t("case_detail_not_provided")}</span>
                    <span>{formatDisplayDate(related.decisionDate) || t("case_detail_not_provided")}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
