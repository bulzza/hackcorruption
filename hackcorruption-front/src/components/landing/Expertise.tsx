import "./../../styles/landing.css";
import {
  FileText,
  Scale,
  Gavel,
  Landmark,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { useI18n } from "../../i18n/useI18n";

export default function Expertise() {
  const { t } = useI18n();

  const expertiseItems = [
    {
      icon: FileText,
      title: t("expertise_1_title"),
      desc: t("expertise_1_desc"),
    },
    {
      icon: Scale,
      title: t("expertise_2_title"),
      desc: t("expertise_2_desc"),
    },
    {
      icon: Gavel,
      title: t("expertise_3_title"),
      desc: t("expertise_3_desc"),
    },
    {
      icon: ShieldCheck,
      title: t("expertise_4_title"),
      desc: t("expertise_4_desc"),
    },
    {
      icon: Landmark,
      title: t("expertise_5_title"),
      desc: t("expertise_5_desc"),
    },
    {
      icon: Briefcase,
      title: t("expertise_6_title"),
      desc: t("expertise_6_desc"),
    },
  ];

  return (
    <section className="expertise-section" id="expertise">
      <div className="container">
        <div className="expertise-heading">
          <h2 className="expertise-title">{t("expertise_title")}</h2>
          <div className="expertise-line" aria-hidden="true"></div>
        </div>

        <div className="expertise-grid">
          {expertiseItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <article className="expertise-card" key={index}>
                <div className="expertise-card-inner">
                  <div className="expertise-icon-wrap">
                    <Icon className="expertise-icon" strokeWidth={1.8} />
                  </div>

                  <div className="expertise-text">
                    <h3 className="expertise-card-title">{item.title}</h3>
                    <p className="expertise-card-description">{item.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}