import type { CSSProperties, ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import casesHero from "../../assets/cases.png";
import courtsHero from "../../assets/courts.jpg";
import judgesHero from "../../assets/judges.png";
import researchHero from "../../assets/research.jpg";

type DataSectionVariant = "courts" | "judges" | "cases" | "research";

type DataSectionHeaderProps = {
  title: string;
  variant: DataSectionVariant;
  showTabs?: boolean;
};

type TabItem = {
  icon: ReactNode;
  key: "data_tab_courts" | "data_tab_judges" | "data_tab_cases";
  to: "/data/courts" | "/data/judges" | "/data/cases";
};

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `tab-btn${isActive ? " active" : ""}`;

const tabItems: TabItem[] = [
  {
    key: "data_tab_courts",
    to: "/data/courts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20H20M6 20V9L12 5L18 9V20M9.5 20V14H14.5V20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "data_tab_judges",
    to: "/data/judges",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12C14.485 12 16.5 9.985 16.5 7.5C16.5 5.015 14.485 3 12 3C9.515 3 7.5 5.015 7.5 7.5C7.5 9.985 9.515 12 12 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M4.5 20C4.5 16.686 7.858 14 12 14C16.142 14 19.5 16.686 19.5 20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "data_tab_cases",
    to: "/data/cases",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M8 3.75H15.25L20 8.5V19.25C20 20.2165 19.2165 21 18.25 21H8C7.0335 21 6.25 20.2165 6.25 19.25V5.5C6.25 4.5335 7.0335 3.75 8 3.75Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M15 3.75V8.75H20M9.5 12H16.5M9.5 16H14.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const heroAssets: Record<
  DataSectionVariant,
  {
    image: string;
    position: string;
  }
> = {
  courts: {
    image: courtsHero,
    position: "center 46%",
  },
  judges: {
    image: judgesHero,
    position: "center 44%",
  },
  cases: {
    image: casesHero,
    position: "center 34%",
  },
  research: {
    image: researchHero,
    position: "center 32%",
  },
};

export default function DataSectionHeader({
  title,
  variant,
  showTabs = true,
}: DataSectionHeaderProps) {
  const { t } = useI18n();
  const heroAsset = heroAssets[variant];
  const heroStyle = {
    "--data-hero-image": `url(${heroAsset.image})`,
    "--data-hero-position": heroAsset.position,
  } as CSSProperties;

  return (
    <section className={`data-section-hero data-section-hero--${variant}`}>
      <div className="data-section-hero-card" style={heroStyle}>
        <div className="container data-section-hero-inner">
          <div className="data-section-hero-copy">
            <span className="data-section-hero-kicker">
              {variant === "research" ? t("nav_research") : t("nav_data")}
            </span>
            <h1 className="data-section-hero-title">{title}</h1>

            <nav className="data-section-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">{t("footer_link_home")}</Link>
              <span aria-hidden="true">/</span>
              <span>{title}</span>
            </nav>
          </div>
        </div>
      </div>

      {showTabs ? (
        <div className="container">
          <nav className="data-tabs" aria-label={`${t("nav_data")} tabs`}>
            {tabItems.map((item) => (
              <NavLink key={item.to} to={item.to} end className={tabClass}>
                <span className="data-tab-icon">{item.icon}</span>
                <span className="data-tab-label">{t(item.key)}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </section>
  );
}
