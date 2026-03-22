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

type DetailField = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

type InsightTone = "good" | "warn" | "bad";

type InsightCard = {
  label: string;
  value: string;
  unit?: string;
  tone?: InsightTone;
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

const normalizedLowercase = (value: string) => value.trim().toLowerCase();

const parseNumericValue = (value: string) => {
  const normalized = value.trim().replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const getSeverityRatioTone = (value: string): InsightTone | undefined => {
  const parsed = parseNumericValue(value);
  if (parsed === null) return undefined;
  if (parsed >= 0.85) return "bad";
  if (parsed >= 0.5) return "warn";
  return "good";
};

const getSentenceSeverityTone = (value: string): InsightTone | undefined => {
  const normalized = normalizedLowercase(value);
  if (!normalized) return undefined;
  if (normalized === "high") return "bad";
  if (normalized === "medium" || normalized === "moderate") return "warn";
  if (normalized === "low" || normalized === "none") return "good";
  return undefined;
};

const getPleaDealTone = (value: string): InsightTone | undefined => {
  const normalized = normalizedLowercase(value);
  if (!normalized) return undefined;
  if (["accepted", "approved", "yes", "true"].includes(normalized)) return "good";
  if (["rejected", "denied"].includes(normalized)) return "bad";
  return undefined;
};

const getAppealTone = (value: string): InsightTone | undefined => {
  const normalized = normalizedLowercase(value);
  if (!normalized) return undefined;
  if (["none", "no", "not filed", "not appealed"].includes(normalized)) return "good";
  if (["filed", "pending", "yes", "appealed"].includes(normalized)) return "warn";
  return undefined;
};

const sortTimeline = (items: NormalizedCaseDetail["timeline"]) =>
  items
    .map((timelineItem, index) => ({ ...timelineItem, index }))
    .sort((left, right) => {
      const leftTime = Date.parse(left.date || "");
      const rightTime = Date.parse(right.date || "");

      if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
        return left.index - right.index;
      }
      if (Number.isNaN(leftTime)) return 1;
      if (Number.isNaN(rightTime)) return -1;
      if (leftTime === rightTime) return left.index - right.index;
      return leftTime - rightTime;
    })
    .map(({ index, ...timelineItem }) => timelineItem);

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

  const detailItems = useMemo<DetailField[]>(
    () =>
      item
        ? [
            { label: t("case_detail_case_type"), value: item.caseType },
            { label: t("case_detail_case_subtype"), value: item.caseSubtype },
            { label: t("case_detail_basis_type"), value: item.basisType },
            { label: t("case_detail_basis"), value: item.basis },
            { label: t("case_detail_articles"), value: item.articles, fullWidth: true },
            {
              label: t("case_detail_public_prosecutor_case"),
              value: item.publicProsecutorCase,
              fullWidth: true,
            },
          ]
        : [],
    [item, t]
  );

  const insightCards = useMemo<InsightCard[]>(
    () =>
      item
        ? [
            { label: t("case_detail_mitigating_factors"), value: item.mitigatingFactors },
            { label: t("case_detail_plea_deal"), value: item.pleaDeal, tone: getPleaDealTone(item.pleaDeal) },
            { label: t("case_detail_duration"), value: item.durationDays, unit: item.durationDays ? t("case_detail_days") : undefined },
            {
              label: t("case_detail_severity_ratio"),
              value: item.severityRatio,
              tone: getSeverityRatioTone(item.severityRatio),
            },
            {
              label: t("case_detail_sentence_severity"),
              value: item.sentenceSeverity,
              tone: getSentenceSeverityTone(item.sentenceSeverity),
            },
            { label: t("case_detail_appeal"), value: item.appeal, tone: getAppealTone(item.appeal) },
          ]
        : [],
    [item, t]
  );

  const timelineItems = useMemo(() => (item ? sortTimeline(item.timeline) : []), [item]);

  const headerMeta = useMemo(
    () => (item ? [item.court, item.judge, item.legalArea].filter((value) => value.trim() !== "") : []),
    [item]
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

  const notProvidedLabel = t("case_detail_not_provided");
  const formattedDecisionDate = formatDisplayDate(item.decisionDate) || notProvidedLabel;

  return (
    <main className="data-page case-detail-page-shell">
      <div className="container case-detail-backbar">
        <Link className="case-detail-backlink" to="/data/cases">
          &larr; {t("case_detail_back")}
        </Link>
      </div>

      <section className="container case-detail-reference-header">
        <div className="case-detail-reference-record-row">
          <h1 className="case-detail-reference-record">{item.id}</h1>
          <div className="case-detail-reference-badges">
            <span className={`case-detail-status ${item.status.toLowerCase()}`}>{getStatusLabel(item.status)}</span>
            <span className="case-detail-date">{formattedDecisionDate}</span>
          </div>
        </div>
        <div className="case-detail-reference-meta">
          {headerMeta.length === 0 ? (
            <span>{notProvidedLabel}</span>
          ) : (
            headerMeta.map((entry, index) => <span key={`${entry}-${index}`}>{entry}</span>)
          )}
        </div>
      </section>

      <div className="container case-detail-reference-layout">
        <div className="case-detail-reference-column">
          <section className="case-detail-reference-section">
            <div className="case-detail-reference-section-head">
              <h2 className="case-detail-reference-section-title">{t("case_detail_case_summary")}</h2>
            </div>
            <div className="case-detail-reference-card case-detail-reference-summary">
              {item.summary || notProvidedLabel}
            </div>
          </section>

          <section className="case-detail-reference-section">
            <div className="case-detail-reference-section-head">
              <h2 className="case-detail-reference-section-title">{t("case_detail_case_details")}</h2>
            </div>
            <div className="case-detail-reference-card">
              <div className="case-detail-reference-details-grid">
                {detailItems.map((entry) => (
                  <div
                    className={`case-detail-reference-detail${entry.fullWidth ? " case-detail-reference-detail--wide" : ""}`}
                    key={entry.label}
                  >
                    <span className="case-detail-reference-label">{entry.label}</span>
                    <span className="case-detail-reference-value">{entry.value || notProvidedLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="case-detail-reference-column case-detail-reference-column--side">
          <section className="case-detail-reference-section">
            <div className="case-detail-reference-section-head">
              <h2 className="case-detail-reference-section-title">{t("case_detail_key_insights")}</h2>
            </div>
            <div className="case-detail-reference-card case-detail-reference-cost-card">
              <div className="case-detail-reference-cost">
                <span className="case-detail-reference-cost-label">{t("case_detail_case_cost")}</span>
                <strong className="case-detail-reference-cost-value">{item.caseCost || notProvidedLabel}</strong>
              </div>
              <div className="case-detail-reference-cost case-detail-reference-cost--right">
                <span className="case-detail-reference-cost-label">{t("case_detail_total_case_cost")}</span>
                <strong className="case-detail-reference-cost-value">{item.totalCaseCost || notProvidedLabel}</strong>
              </div>
            </div>

            <div className="case-detail-reference-kpi-grid">
              {insightCards.map((entry) => (
                <div className="case-detail-reference-card case-detail-reference-kpi-card" key={entry.label}>
                  <strong
                    className={`case-detail-reference-kpi-value${
                      entry.tone ? ` case-detail-reference-kpi-value--${entry.tone}` : ""
                    }`}
                  >
                    {entry.value || notProvidedLabel}
                  </strong>
                  {entry.unit && entry.value ? (
                    <span className="case-detail-reference-kpi-unit">{entry.unit}</span>
                  ) : null}
                  <span className="case-detail-reference-kpi-label-row">
                    <span className="case-detail-reference-label">{entry.label}</span>
                    <span aria-hidden="true" className="kpi-info-icon" title={entry.label}>
                      ?
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="case-detail-reference-section">
            <div className="case-detail-reference-section-head">
              <h2 className="case-detail-reference-section-title">{t("case_detail_timeline")}</h2>
            </div>
            {timelineItems.length === 0 ? (
              <div className="case-detail-reference-empty">{t("case_detail_no_timeline")}</div>
            ) : (
              <div className="case-detail-reference-timeline timeline">
                {timelineItems.map((timelineItem, index) => (
                  <div className="timeline-item" key={`${timelineItem.date}-${index}`}>
                    <div className="timeline-marker">
                      <div className={`timeline-dot ${index === timelineItems.length - 1 ? "active" : ""}`} />
                      {index !== timelineItems.length - 1 ? <div className="timeline-line" /> : null}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-date">{formatDisplayDate(timelineItem.date) || notProvidedLabel}</div>
                      <div className="timeline-title">{timelineItem.name || notProvidedLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="container case-detail-reference-related">
        <div className="case-detail-reference-section-head">
          <h2 className="case-detail-reference-section-title">{t("case_detail_related_cases")}</h2>
        </div>
        {relatedCases.length === 0 ? (
          <div className="case-detail-reference-empty">{t("case_detail_no_related_cases")}</div>
        ) : (
          <div className="case-detail-reference-related-grid">
            {relatedCases.map((related) => (
              <article className="case-detail-reference-card case-detail-reference-related-card" key={related.recordKey}>
                <Link className="case-detail-reference-related-title" to={`/data/cases/${encodeURIComponent(related.id)}`}>
                  {related.id}
                </Link>
                <div className="case-detail-reference-related-meta">
                  <span>{related.court || notProvidedLabel}</span>
                  <span>{related.judge || notProvidedLabel}</span>
                  <span>{formatDisplayDate(related.decisionDate) || notProvidedLabel}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
