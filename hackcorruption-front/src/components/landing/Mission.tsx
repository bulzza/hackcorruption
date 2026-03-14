import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";

export default function Mission() {
  const { t } = useI18n();

  return (
    <section className="mission section-light">
      <div className="container">
        <div className="mission-frame">
          <div className="mission-grid">
            <div className="mission-heading">
              <div className="expertise-line mission-line" aria-hidden="true"></div>
              <h2 className="mission-title" style={{ whiteSpace: "pre-line" }}>
                {t("mission_title")}
              </h2>
            </div>

            <div className="mission-copy">
              <p className="mission-desc">{t("mission_desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
