import { Link } from "react-router-dom";

const metricCards = [
  {
    label: "Total Cases",
    value: "1,248",
    meta: "Since last month",
    tone: "warning",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 7V17M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.88 13.38 12 12 12C10.62 12 9.5 13.12 9.5 14.5C9.5 15.88 10.62 17 12 17C13.38 17 14.5 15.88 14.5 14.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Open Cases",
    value: "312",
    meta: "Currently active",
    tone: "danger",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3V7M16 3V7M4 10H20" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    label: "Judges On Duty",
    value: "24",
    meta: "Assigned today",
    tone: "success",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path
          d="M7 4H14L19 9V20H7V4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M14 4V9H19" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 13H15M9 16H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Avg. Resolution Time",
    value: "42 days",
    meta: "Median across closed cases",
    tone: "info",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path
          d="M8.5 11.5V5.5C8.5 4.12 9.62 3 11 3H12.5C13.88 3 15 4.12 15 5.5V11.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7 11.5H17C18.657 11.5 20 12.843 20 14.5V18C20 19.105 19.105 20 18 20H6C4.895 20 4 19.105 4 18V14.5C4 12.843 5.343 11.5 7 11.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 8.5V14.5M12 14.5L9.5 12M12 14.5L14.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const actionCards = [
  {
    title: "Courts",
    description: "Create, update, and audit court records.",
    links: [
      { label: "View list", to: "/dashboard/courts", variant: "primary" },
      { label: "New court", to: "/dashboard/courts/new", variant: "ghost" },
    ],
  },
  {
    title: "Judges",
    description: "Maintain judge profiles and assignments.",
    links: [
      { label: "View list", to: "/dashboard/judges", variant: "primary" },
      { label: "New judge", to: "/dashboard/judges/new", variant: "ghost" },
    ],
  },
  {
    title: "Cases",
    description: "Track filings, outcomes, and evidence.",
    links: [
      { label: "View list", to: "/dashboard/cases", variant: "primary" },
      { label: "New case", to: "/dashboard/cases/new", variant: "ghost" },
    ],
  },
  {
    title: "Users",
    description: "Provision accounts and manage access roles.",
    links: [
      { label: "View list", to: "/dashboard/users", variant: "primary" },
      { label: "New user", to: "/dashboard/users/new", variant: "ghost" },
    ],
  },
];

const trafficSources = [
  { label: "Open", value: 25 },
  { label: "Under Investigation", value: 20 },
  { label: "Closed", value: 40 },
  { label: "On Appeal", value: 10 },
  { label: "Pending", value: 5 },
];

const donutLegend = [
  { label: "Criminal", className: "dot-red" },
  { label: "Civil", className: "dot-blue" },
  { label: "Administrative", className: "dot-teal" },
];

export default function DashboardPage() {
  return (
    <>
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Dashboard</span>
      </nav>

      <section className="dashboard-metric-grid">
        {metricCards.map((card) => (
          <div className={`dashboard-metric-card tone-${card.tone}`} key={card.label}>
            <div className="dashboard-metric-top">
              <div>
                <div className="dashboard-metric-value">{card.value}</div>
                <div className="dashboard-metric-label">{card.label}</div>
              </div>
              <div className="dashboard-metric-icon" aria-hidden="true">
                {card.icon}
              </div>
            </div>
            <div className="dashboard-metric-bottom">
              <span>{card.meta}</span>
              <span className="dashboard-metric-trend" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M4 16L10 10L14 14L20 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 8V14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-actions">
        <div className="dashboard-actions-header">
          <div>
            <div className="dashboard-actions-title">Quick actions</div>
            <div className="dashboard-actions-subtitle">
              Jump into CRUD workflows for each dataset.
            </div>
          </div>
          <Link className="dashboard-actions-link" to="/data/cases">
            View all datasets
          </Link>
        </div>
        <div className="dashboard-actions-grid">
          {actionCards.map((card) => (
            <div className="dashboard-action-card" key={card.title}>
              <div className="dashboard-action-title">{card.title}</div>
              <div className="dashboard-action-desc">{card.description}</div>
              <div className="dashboard-action-links">
                {card.links.map((link) => (
                  <Link
                    className={`dashboard-action-link ${link.variant}`}
                    to={link.to}
                    key={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-panels">
        <div className="dashboard-panel dashboard-panel-sales">
          <div className="dashboard-panel-head">
            <div className="dashboard-panel-head-row">
              <span className="dashboard-panel-title">Cases Resolved Per Day</span>
              <span className="dashboard-panel-change">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path
                    d="M5 15L11 9L15 13L20 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                3%
              </span>
            </div>
            <div className="dashboard-panel-chart">
              <svg viewBox="0 0 300 120" preserveAspectRatio="none">
                <path
                  d="M0 80 C30 60 60 100 90 85 C120 70 150 20 180 30 C210 40 240 95 270 70 C285 60 295 50 300 45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="dashboard-panel-foot">
            <div className="dashboard-panel-stat">
              <div className="dashboard-panel-stat-value">1,248</div>
              <div className="dashboard-panel-stat-label">Total Cases Resolved</div>
            </div>
            <div className="dashboard-panel-stat">
              <div className="dashboard-panel-stat-value">28</div>
              <div className="dashboard-panel-stat-label">Cases Resolved Today</div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel dashboard-panel-revenue">
          <div className="dashboard-panel-header">Case Types Breakdown</div>
          <div className="dashboard-revenue-body">
            <div className="dashboard-donut">
              <div className="dashboard-donut-hole" />
            </div>
            <div className="dashboard-donut-legend">
              {donutLegend.map((item) => (
                <span className="dashboard-donut-item" key={item.label}>
                  <span className={`dashboard-donut-dot ${item.className}`} aria-hidden="true" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-panel dashboard-panel-traffic">
          <div className="dashboard-panel-header">Case Statuses</div>
          <div className="dashboard-traffic-list">
            {trafficSources.map((source) => (
              <div className="dashboard-traffic-row" key={source.label}>
                <div className="dashboard-traffic-head">
                  <span className="dashboard-traffic-label">{source.label}</span>
                  <span className="dashboard-traffic-value">{source.value}%</span>
                </div>
                <div className="dashboard-traffic-bar">
                  <span style={{ width: `${source.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
