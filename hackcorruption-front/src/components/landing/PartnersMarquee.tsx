import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";

// import three partner logos from assets
import DGLogo from "../../assets/DG_IREX_Logo_2021.jpg";
import ALLogo from "../../assets/AL Main Logo.png";
import HCLogo from "../../assets/HC logo.png";

export default function PartnersMarquee() {
  const { t } = useI18n();

  // replace the text placeholders with actual images
  const logos = [DGLogo, ALLogo, HCLogo];

  const items = logos.map((src, i) => (
    <span key={i} className="partner-item">
      <img className="partner-logo" src={src} alt={`partner-${i}`} />
    </span>
  ));

  return (
    <section className="partners-section">
      <p className="partners-label">{t("partners_label")}</p>
      <div className="marquee-container">
        <div className="marquee-content">
          {items}
          {items} {/* duplicate to create infinite-scrolling effect */}
        </div>
      </div>
    </section>
  );
}
