import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";
import FeatureCard from "./FeatureCard";

import gavel from "../../assets/feature-gavel.png";
import digital from "../../assets/feature-digital.png";
import scales from "../../assets/feature-scales.png";

export default function Features() {
  const { t } = useI18n();
  const featureItems = [
    {
      img: gavel,
      alt: "Gavel",
      title: t("feature_search_title"),
      desc: t("feature_search_desc"),
    },
    {
      img: digital,
      alt: "Digital Circuit Logic",
      title: t("feature_ai_title"),
      desc: t("feature_ai_desc"),
    },
    {
      img: scales,
      alt: "Lady Justice",
      title: t("feature_reporting_title"),
      desc: t("feature_reporting_desc"),
    },
  ];

  return (
    <section className="features section-light" id="features">
      <div className="container">
        <div className="features-shell">
          <div className="features-grid">
            {featureItems.map((item, index) => (
              <FeatureCard
                key={item.title}
                index={index + 1}
                img={item.img}
                alt={item.alt}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
