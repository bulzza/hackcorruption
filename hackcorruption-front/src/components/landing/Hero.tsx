import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";
import heroVideo from "../../assets/videoplayback.mp4";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero">
      <video
        className="hero-bg-video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="hero-overlay" aria-hidden="true"></div>

      <div className="container hero-content">
        <div className="hero-text">
          <span className="hero-eyebrow">{t("hero_eyebrow")}</span>
          <h1 className="hero-title">{t("hero_title")}</h1>

          <div className="hero-actions">
            <a href="#" className="btn btn-primary hero-btn">
              {t("btn_get_insights")}
            </a>

            <a href="#features" className="btn hero-btn hero-btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}