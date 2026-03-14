import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import { AUTH_LOGIN_URL, AUTH_LOGOUT_URL } from "../../services/apiConfig";

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="data-page login-page-shell">
      <div className="container login-page-container">
        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-header">
            <h1 id="login-title" className="login-panel-title">
              {t("nav_login")}
            </h1>
            <p className="login-panel-subtitle">Admin access only.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div role="alert" className="login-alert">
                {error}
              </div>
            )}

            <div className="form-group login-form-group">
              <label className="form-label" htmlFor="login-email">
                Email <span className="required-mark">*</span>
              </label>
              <input
                id="login-email"
                className="form-input login-form-input"
                type="email"
                name="email"
                placeholder="Enter email"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group login-form-group">
              <label className="form-label" htmlFor="login-password">
                Password <span className="required-mark">*</span>
              </label>
              <input
                id="login-password"
                className="form-input login-form-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>

            <label className="login-toggle">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
              <span>Show password</span>
            </label>

            <button type="submit" className="submit-btn login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
