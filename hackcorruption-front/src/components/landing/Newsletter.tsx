import "../../styles/landing.css";
import { useI18n } from "../../i18n/useI18n";
import { useState } from "react";

export default function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    alert("Subscribed!");
    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="container newsletter-content">
        <h2 className="section-title large" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          {t("newsletter_title")}
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "2rem", textAlign: "center" }}>
          {t("newsletter_desc")}
        </p>

        <form className="newsletter-form" onSubmit={submit}>
          <input
            type="email"
            placeholder={t("newsletter_placeholder")}
            required
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            {t("newsletter_btn")}
          </button>
        </form>
      </div>
    </section>
  );
}
