import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";
import FeatureCard from "./FeatureCard";

import gavel from "../../assets/feature-gavel.png";
import digital from "../../assets/feature-digital.png";
import scales from "../../assets/feature-scales.png";

export default function Features() {
  const { t } = useI18n();

  return (
    <section className="features section-light">
      <div className="container features-grid">
        <FeatureCard
          img={gavel}
          alt="Gavel"
          title={t("feature_search_title")}
          desc={t("feature_search_desc")}
        />
        <FeatureCard
          img={digital}
          alt="Digital Circuit Logic"
          title={t("feature_ai_title")}
          desc={t("feature_ai_desc")}
        />
        <FeatureCard
          img={scales}
          alt="Lady Justice"
          title={t("feature_reporting_title")}
          desc={t("feature_reporting_desc")}
        />
      </div>
    </section>
  );
}
