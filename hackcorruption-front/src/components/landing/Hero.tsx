import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";

import heroImg from "../../assets/hero-balance.png";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">{t("hero_title")}</h1>
          <div className="hero-actions">
            <a href="#" className="btn btn-primary">
              {t("btn_get_insights")}
            </a>
          </div>
        </div>

        <div className="hero-image-container">
          <img
            src={heroImg}
            alt="Legal Balance Scale and Gavel"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  );
}
