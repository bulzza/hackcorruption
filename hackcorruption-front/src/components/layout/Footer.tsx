import "./../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <a href="#" className="footer-logo">
            JusticiaAI
          </a>

          <div className="social-icons">
            <a className="social-link" href="#" aria-label="Facebook">
              Facebook
            </a>
            <a className="social-link" href="#" aria-label="Twitter">
              Twitter
            </a>
            <a className="social-link" href="#" aria-label="Instagram">
              Instagram
            </a>
          </div>

          <div className="copyright">{t("footer_rights")}</div>
        </div>
      </div>
    </footer>
  );
}
