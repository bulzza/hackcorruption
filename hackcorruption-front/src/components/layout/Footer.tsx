import "./../../styles/landing.css";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-column footer-about">
          <h3 className="footer-heading">{t("footer_about_heading")}</h3>
          <p className="footer-text">{t("footer_about_text")}</p>
        </div>

        <div className="footer-column footer-nav">
          <h3 className="footer-heading">{t("footer_nav_heading")}</h3>
          <div className="footer-links-grid">
            <Link to="/" className="footer-link">
              {t("footer_link_home")}
            </Link>
            <Link to="/" className="footer-link">
              {t("nav_about")}
            </Link>
            <Link to="/data/courts" className="footer-link">
              {t("nav_data")}
            </Link>
            <a href="/#expertise" className="footer-link">
              {t("expertise_title")}
            </a>
            <Link to="/research" className="footer-link">
              {t("nav_research")}
            </Link>
            <Link to="/contact" className="footer-link">
              {t("nav_contact")}
            </Link>
            <Link to="/login" className="footer-link">
              {t("nav_login")}
            </Link>
          </div>
        </div>

        <div className="footer-column footer-connect">
          <h3 className="footer-heading">{t("newsletter_title")}</h3>

          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              type="email"
              className="newsletter-input"
              placeholder={t("newsletter_placeholder")}
            />
            <button type="submit" className="btn footer-subscribe-btn">
              {t("newsletter_btn")}
            </button>
          </form>

          <div className="footer-social-block">
            <h3 className="footer-heading footer-heading-small">{t("footer_follow_heading")}</h3>
            <div className="social-icons">
              <a className="social-link" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                Facebook
              </a>
              <a className="social-link" href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
                X
              </a>
              <a className="social-link" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <Link to="/" className="footer-logo">JusticiaAI</Link>
        <div className="copyright">{t("footer_rights")}</div>
      </div>
    </footer>
  );
}
