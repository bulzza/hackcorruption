import type { CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { getCaseById } from "../../data/cases";
import { getCourtById } from "../../data/courts";
import type { CourtChartItem } from "../../data/courts";

type BarChartProps = {
  data: CourtChartItem[];
  maxValue: number;
  tickCount?: number;
  formatTick?: (value: number) => string;
  unitLabel?: string;
};

type DonutChartProps = {
  items: CourtChartItem[];
  centerLabel: string;
  centerValue: string;
};

function BarChart({ data, maxValue, tickCount = 5, formatTick, unitLabel }: BarChartProps) {
  const ticks = Array.from({ length: tickCount }, (_, index) =>
    Math.round(maxValue - (maxValue / (tickCount - 1)) * index)
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
                height: `${(item.value / maxValue) * 100}%`,
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
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-chart">
      <svg className="donut-svg" viewBox="0 0 160 160">
        <circle className="donut-track" cx="80" cy="80" r={radius} strokeWidth="20" />
        {items.map((item) => {
          const dash = (item.value / total) * circumference;
          const segment = (
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
          );
          offset += dash;
          return segment;
        })}
      </svg>
      <div className="donut-center">
        <div className="donut-center-label">{centerLabel}</div>
        <div className="donut-center-value">{centerValue}</div>
      </div>
    </div>
  );
}

export default function CourtDetailPage() {
  const { courtId } = useParams();
  const court = getCourtById(decodeURIComponent(courtId ?? ""));

  if (!court) {
    return (
      <main className="data-page">
        <div className="container" style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
          <h1 className="section-title large">Court not found</h1>
          <Link to="/data/courts" style={{ color: "#3b82f6", textDecoration: "none" }}>
            &#8592; Back to Courts
          </Link>
        </div>
      </main>
    );
  }

  const caseTypesTotal = court.caseTypes.reduce((sum, item) => sum + item.value, 0);
  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <main className="court-profile-main">
      <div className="container court-detail-top">
        <Link className="court-back-link" to="/data/courts">
          &#8592; Back to Courts
        </Link>
        <button className="court-export-btn" type="button">
          <span className="court-export-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v12m0 0l4-4m-4 4l-4-4M4 19h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Export Insights
        </button>
      </div>

      <section className="court-header">
        <div className="container">
          <h1 className="court-title">{court.name}</h1>
          <div className="court-subtitle">{court.type}</div>

          <div className="court-info-grid">
            <div className="court-info-label">Address:</div>
            <div className="court-info-value">{court.address}</div>
            <div className="court-info-label">Phone:</div>
            <div className="court-info-value">{court.phones.join(", ")}</div>
            <div className="court-info-label">Jurisdiction:</div>
            <div className="court-info-value">{court.jurisdiction.replace("Jurisdiction: ", "")}</div>
          </div>

          <div className="court-section">
            <div className="court-section-title">About the Court</div>
            <p className="court-section-text">{court.about}</p>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="court-kpi-section">
          <div className="kpi-grid">
            {court.metrics.map((metric) => (
              <div className="kpi-card" key={metric.label}>
                <span className={`kpi-value${metric.tone ? ` ${metric.tone}` : ""}`}>
                  {metric.value}
                </span>
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
        </section>

        <section className="court-charts-grid">
          <div className="court-chart-card">
            <div className="court-chart-title">Case Types</div>
            <DonutChart
              items={court.caseTypes}
              centerLabel="Total Cases"
              centerValue={caseTypesTotal.toString()}
            />
            <div className="chart-legend">
              {court.caseTypes.map((item) => (
                <div className="chart-legend-item" key={item.label}>
                  <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="court-chart-card">
            <div className="court-chart-title">Total Cases per Year</div>
            <BarChart
              data={court.casesPerYear}
              maxValue={1200}
              tickCount={7}
              formatTick={formatNumber}
            />
          </div>
        </section>

        <section className="court-charts-grid">
          <div className="court-chart-card">
            <div className="court-chart-title">Average Time per Case Type</div>
            <BarChart data={court.avgTimeByType} maxValue={250} tickCount={6} unitLabel="Days" />
            <div className="bar-chart-legend">
              {court.avgTimeByType.map((item) => (
                <div className="chart-legend-item" key={item.label}>
                  <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="court-chart-card">
            <div className="court-chart-title">Average Cost per Case Type</div>
            <BarChart
              data={court.avgCostByType}
              maxValue={3000}
              tickCount={7}
              formatTick={formatNumber}
              unitLabel="EUR"
            />
            <div className="bar-chart-legend">
              {court.avgCostByType.map((item) => (
                <div className="chart-legend-item" key={item.label}>
                  <span className="legend-swatch" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="court-cases-section">
          <div className="section-label">Cases</div>
          <div className="cases-table-wrapper">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Type</th>
                  <th>Subtype</th>
                  <th>Basis Type</th>
                  <th>Filing Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {court.cases.map((item) => {
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
