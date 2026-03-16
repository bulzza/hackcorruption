import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { getCaseById } from "../../data/cases";
import type { CourtChartItem, CourtMetric } from "../../data/courts";
import { getCourtById as getApiCourtById } from "../../services/courtsService";
import type { CourtDetail } from "../../services/courtsService";

type BarChartProps = {
  data: CourtChartItem[];
  maxValue?: number;
  tickCount?: number;
  formatTick?: (value: number) => string;
  unitLabel?: string;
};

type DonutChartProps = {
  items: CourtChartItem[];
  centerLabel: string;
  centerValue: string;
};

type NormalizedCourt = CourtDetail & {
  typeLabel: string;
  phonesLabel: string;
};

const formatWebsite = (value: string | null | undefined) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

const normalizeCourt = (court: CourtDetail): NormalizedCourt => ({
  ...court,
  typeLabel: court.type?.trim() || court.cardTag?.trim() || "Court",
  phonesLabel: court.phones.filter(Boolean).join(", ") || "",
  website: formatWebsite(court.website),
});

function ChartEmptyState({ message }: { message: string }) {
  return <div className="court-chart-empty">{message}</div>;
}

function BarChart({ data, maxValue, tickCount = 5, formatTick, unitLabel }: BarChartProps) {
  const { t } = useI18n();
  if (data.length === 0) {
    return <ChartEmptyState message={t("court_detail_no_chart_data")} />;
  }

  const derivedMax = Math.max(maxValue ?? 0, ...data.map((item) => item.value), 1);
  const ticks = Array.from({ length: tickCount }, (_, index) =>
    Math.round(derivedMax - (derivedMax / Math.max(tickCount - 1, 1)) * index)
  );
  const formatter = formatTick ?? ((value: number) => value.toString());
  const gridStyle = {
    "--bar-count": data.length,
    "--grid-rows": Math.max(tickCount - 1, 1),
  } as CSSProperties;

  return (
    <div className="bar-chart">
      <div className="bar-chart-y">
        {ticks.map((tick, index) => (
          <span key={`${tick}-${index}`}>{formatter(tick)}</span>
        ))}
        {unitLabel ? <span className="bar-chart-unit">{unitLabel}</span> : null}
      </div>
      <div className="bar-chart-canvas">
        <div className="bar-chart-grid" style={gridStyle}>
          {data.map((item) => (
            <div
              className="bar-chart-bar"
              key={item.label}
              style={{
                height: `${(item.value / derivedMax) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.label}: ${item.value}`}
            />
          ))}
        </div>
        <div className="bar-chart-axis" style={gridStyle}>
          {data.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutChart({ items, centerLabel, centerValue }: DonutChartProps) {
  const { t } = useI18n();
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (items.length === 0 || total <= 0) {
    return <ChartEmptyState message={t("court_detail_no_distribution")} />;
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const segments = items.reduce(
    (state, item) => {
      const dash = (item.value / total) * circumference;
      return {
        offset: state.offset + dash,
        segments: [...state.segments, { item, dash, offset: state.offset }],
      };
    },
    {
      offset: 0,
      segments: [] as Array<{ item: CourtChartItem; dash: number; offset: number }>,
    }
  ).segments;

  return (
    <div className="donut-chart">
      <svg className="donut-svg" viewBox="0 0 160 160">
        <circle className="donut-track" cx="80" cy="80" r={radius} strokeWidth="20" />
        {segments.map(({ item, dash, offset }) => (
          <circle
            key={item.label}
            className="donut-segment"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="20"
            stroke={item.color}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
          />
        ))}
      </svg>
      <div className="donut-center">
        <div className="donut-center-label">{centerLabel}</div>
        <div className="donut-center-value">{centerValue}</div>
      </div>
    </div>
  );
}

function MetricsGrid({ metrics }: { metrics: CourtMetric[] }) {
  const { t } = useI18n();
  if (metrics.length === 0) {
    return <div className="court-chart-empty">{t("court_detail_no_metrics")}</div>;
  }

  return (
    <div className="kpi-grid">
      {metrics.map((metric) => (
        <div className="kpi-card" key={metric.label}>
          <span className={`kpi-value${metric.tone ? ` ${metric.tone}` : ""}`}>{metric.value}</span>
          <span className="kpi-label">
            {metric.label}
            {metric.info ? (
              <span className="kpi-info-icon">
                ?
                <span className="kpi-tooltip">{metric.info}</span>
              </span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function CourtDetailPage() {
  const { t } = useI18n();
  const { courtId } = useParams();
  const decodedId = decodeURIComponent(courtId ?? "");
  const [court, setCourt] = useState<NormalizedCourt | null>(null);
  const [fetchState, setFetchState] = useState<"idle" | "loading" | "done">(decodedId ? "loading" : "done");

  useEffect(() => {
    let mounted = true;

    if (!decodedId) {
      queueMicrotask(() => {
        if (!mounted) return;
        setCourt(null);
        setFetchState("done");
      });
      return () => {
        mounted = false;
      };
    }

    queueMicrotask(() => {
      if (!mounted) return;
      setCourt(null);
      setFetchState("loading");
    });

    getApiCourtById(decodedId)
      .then((data) => {
        if (!mounted) return;
        setCourt(data ? normalizeCourt(data) : null);
        setFetchState("done");
      })
      .catch((err) => {
        console.warn(err);
        if (!mounted) return;
        setCourt(null);
        setFetchState("done");
      });

    return () => {
      mounted = false;
    };
  }, [decodedId]);

  const topCaseTypes = useMemo(
    () => [...(court?.caseTypes ?? [])].sort((left, right) => right.value - left.value).slice(0, 3),
    [court]
  );
  const topCaseTypesTotal = useMemo(() => topCaseTypes.reduce((sum, item) => sum + item.value, 0), [topCaseTypes]);
  const recentCases = useMemo(() => court?.cases.slice(0, 10) ?? [], [court]);
  const getCaseStatusLabel = (status: string) => {
    if (status === "Active") return t("status_active");
    if (status === "Closed") return t("status_closed");
    return t("status_unknown");
  };

  const formatNumber = (value: number) => value.toLocaleString();

  if (!court && fetchState === "loading") {
    return (
      <main className="court-profile-main">
        <div className="container court-detail-state-wrap">
          <div className="court-detail-state-card">
            <h1 className="court-detail-state-title">{t("court_detail_loading")}</h1>
          </div>
        </div>
      </main>
    );
  }

  if (!court) {
    return (
      <main className="court-profile-main">
        <div className="container court-detail-state-wrap">
          <div className="court-detail-state-card">
            <h1 className="court-detail-state-title">{t("court_detail_not_found")}</h1>
            <Link className="court-back-link" to="/data/courts">
              &larr; {t("court_detail_back")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="court-profile-main">
      <div className="container court-detail-top">
        <Link className="court-back-link" to="/data/courts">
          &larr; {t("court_detail_back")}
        </Link>
        {court.website ? (
          <a className="court-export-btn" href={court.website} target="_blank" rel="noreferrer">
            <span className="court-export-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H9M17 7v8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {t("court_detail_visit_website")}
          </a>
        ) : null}
      </div>

      <section className="court-header">
        <div className="container">
          <div className="court-header-shell">
            <div className="court-header-main">
              <h1 className="court-title">{court.name}</h1>
              <div className="court-subtitle">{court.typeLabel}</div>
              <p className="court-section-text court-lead-text">
                {court.about?.trim() || t("court_detail_about_fallback")}
              </p>
            </div>

            <div className="court-info-grid">
              <div className="court-info-label">{t("court_detail_address")}</div>
              <div className="court-info-value">{court.address || t("court_detail_not_provided")}</div>
              <div className="court-info-label">{t("court_detail_phone")}</div>
              <div className="court-info-value">{court.phonesLabel || t("court_detail_not_provided")}</div>
              <div className="court-info-label">{t("court_detail_jurisdiction")}</div>
              <div className="court-info-value">{court.jurisdiction || t("court_detail_not_provided")}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="court-kpi-section">
          <MetricsGrid metrics={court.metrics} />
        </section>

        <section className="court-charts-grid">
          <div className="court-chart-card">
            <div className="court-chart-title">{t("court_detail_top_case_types")}</div>
            <DonutChart
              items={topCaseTypes}
              centerLabel={t("court_detail_total_cases")}
              centerValue={topCaseTypesTotal.toString()}
            />
            {topCaseTypes.length > 0 ? (
              <div className="chart-legend">
                {topCaseTypes.map((item) => (
                  <div className="chart-legend-item" key={item.label}>
                    <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="court-chart-card">
            <div className="court-chart-title">{t("court_detail_total_cases_per_year")}</div>
            <BarChart data={court.casesPerYear} tickCount={7} formatTick={formatNumber} />
          </div>
        </section>

        <section className="court-charts-grid">
          <div className="court-chart-card">
            <div className="court-chart-title">{t("court_detail_avg_time")}</div>
            <BarChart data={court.avgTimeByType} tickCount={6} unitLabel="Days" />
            {court.avgTimeByType.length > 0 ? (
              <div className="bar-chart-legend">
                {court.avgTimeByType.map((item) => (
                  <div className="chart-legend-item" key={item.label}>
                    <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="court-chart-card">
            <div className="court-chart-title">{t("court_detail_avg_cost")}</div>
            <BarChart data={court.avgCostByType} tickCount={7} formatTick={formatNumber} unitLabel="EUR" />
            {court.avgCostByType.length > 0 ? (
              <div className="bar-chart-legend">
                {court.avgCostByType.map((item) => (
                  <div className="chart-legend-item" key={item.label}>
                    <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="court-cases-section">
          <div className="court-section-head">
            <div className="section-label">{t("court_detail_recent_cases")}</div>
            <div className="court-section-caption">{t("court_detail_recent_cases_caption")}</div>
          </div>
          <div className="cases-table-wrapper">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>{t("court_detail_case_id")}</th>
                  <th>{t("court_detail_type")}</th>
                  <th>{t("court_detail_subtype")}</th>
                  <th>{t("court_detail_basis_type")}</th>
                  <th>{t("court_detail_filing_date")}</th>
                  <th>{t("court_detail_status")}</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="court-chart-empty">{t("court_detail_no_cases")}</div>
                    </td>
                  </tr>
                ) : (
                  recentCases.map((item) => {
                    const statusClass =
                      item.status === "Active"
                        ? "status-active"
                        : item.status === "Closed"
                          ? "status-closed"
                          : "status-unknown";
                    const hasCase = Boolean(getCaseById(item.id));

                    return (
                      <tr key={`${court.id}-${item.id}`}>
                        <td>
                          {hasCase ? (
                            <Link className="meta-value-link" to={`/data/cases/${encodeURIComponent(item.id)}`}>
                              {item.id}
                            </Link>
                          ) : (
                            <span className="meta-value-link">{item.id}</span>
                          )}
                        </td>
                        <td>{item.type || t("court_detail_not_provided")}</td>
                        <td>{item.subtype || t("court_detail_not_provided")}</td>
                        <td>{item.basisType || t("court_detail_not_provided")}</td>
                        <td>{item.filingDate || t("court_detail_not_provided")}</td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>{getCaseStatusLabel(item.status)}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
