import "./../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-column footer-about">
          <h3 className="footer-heading">ABOUT JUSTICIAAI</h3>
          <p className="footer-text">
            JusticiaAI helps transform judicial and legal information into clear,
            accessible, and meaningful insights for transparency, efficiency,
            and better decision-making.
          </p>
        </div>

        <div className="footer-column footer-nav">
          <h3 className="footer-heading">NAVIGATION</h3>
          <div className="footer-links-grid">
            <a href="#" className="footer-link">Home</a>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Practice Area</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Case Studies</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Membership</a>
          </div>
        </div>

        <div className="footer-column footer-connect">
          <h3 className="footer-heading">SUBSCRIBE</h3>

          <form className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email"
            />
            <button type="submit" className="btn footer-subscribe-btn">
              Subscribe
            </button>
          </form>

          <div className="footer-social-block">
            <h3 className="footer-heading footer-heading-small">FOLLOW US</h3>
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
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <a href="#" className="footer-logo">JusticiaAI</a>
        <div className="copyright">{t("footer_rights")}</div>
      </div>
    </footer>
  );
}