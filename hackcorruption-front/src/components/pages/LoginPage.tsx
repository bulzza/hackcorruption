import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { AUTH_LOGIN_URL, AUTH_LOGOUT_URL } from "../../services/apiConfig";

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(AUTH_LOGIN_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; user?: any; error?: string; message?: string }
        | null;

      if (!response.ok || !data || data.ok !== true) {
        setError(data?.error || data?.message || `Login failed (${response.status}).`);
        return;
      }

      // only allow admin users to proceed
      const role = String(data.user?.role || "").toLowerCase();
      const hasRole = role.length > 0;
      if (hasRole && role !== "admin") {
        // clear server session if any
        try {
          await fetch(AUTH_LOGOUT_URL, { method: "POST", credentials: "include" });
        } catch (e) {
          console.warn("failed to clear session", e);
        }
        try {
          localStorage.setItem("hc_auth_state", "logged_out");
        } catch {}
        setError("Only admin users are allowed to sign in here.");
        return;
      }

      try {
        localStorage.setItem("hc_auth_state", "admin");
      } catch {}
      form.reset();
      navigate("/dashboard");
    } catch (err) {
      console.warn("login failed", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="data-page">
      <div className="container" style={{ paddingTop: "6rem", paddingBottom: "4rem", maxWidth: "480px" }}>
        <h1 className="section-title large">{t("nav_login")}</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          {error && (
            <div role="alert" style={{ color: "#b91c1c", fontSize: "0.95rem" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Email <span className="required-mark">*</span>
            </label>
            <input className="form-input" type="email" name="email" required autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required-mark">*</span>
            </label>
            <input className="form-input" type="password" name="password" required autoComplete="current-password" />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
