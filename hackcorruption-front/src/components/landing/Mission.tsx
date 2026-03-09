import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";

export default function Mission() {
  const { t } = useI18n();

  return (
    <section className="mission section-light">
      <div className="container mission-content">
        <h2 className="mission-title" style={{ whiteSpace: "pre-line" }}>
          {t("mission_title")}
        </h2>
        <p className="mission-desc">{t("mission_desc")}</p>
      </div>
    </section>
  );
}
