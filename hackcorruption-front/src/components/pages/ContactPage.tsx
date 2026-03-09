import { useI18n } from "../../i18n/useI18n";

export default function ContactPage() {
  const { t } = useI18n();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <main className="contact-page">
      <div className="container contact-layout">
        <div>
          <h1 className="contact-title">{t("nav_contact")}</h1>
          <p className="contact-text" data-i18n="contact_text_1">
              At JusticiaAI, we believe that innovation is essential to advancing justice. By embracing
              technology, we aim to enhance legal decision-making, reduce reliance on outdated systems,
              and promote a fair, efficient, and equitable legal process.
          </p>
          <p className="contact-text" data-i18n="contact_text_2">
            For inquiries, collaborations, or further information, please contact us.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Name <span className="required-mark">*</span>
            </label>
            <div className="name-inputs">
              <div>
                <label className="sub-label">First</label>
                <input className="form-input" type="text" name="firstName" required />
              </div>
              <div>
                <label className="sub-label">Last</label>
                <input className="form-input" type="text" name="lastName" required />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span className="required-mark">*</span>
            </label>
            <input className="form-input" type="email" name="email" required />
          </div>

          <div className="form-group">
            <label className="form-label">
              Subject <span className="required-mark">*</span>
            </label>
            <input className="form-input" type="text" name="subject" required />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-input form-textarea" name="message" rows={5} />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
