import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearSiteAccessState,
  getSiteAccessSession,
  loginSiteAccess,
} from "../../services/siteAccessService";

type SiteAccessLocationState = {
  from?: string;
};

export default function SiteAccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as SiteAccessLocationState | null)?.from || "/";
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let mounted = true;

    getSiteAccessSession()
      .then((data) => {
        if (!mounted) return;
        if (data?.ok === true) {
          navigate(redirectTo, { replace: true });
          return;
        }
        clearSiteAccessState();
      })
      .catch(() => {
        if (!mounted) return;
        clearSiteAccessState();
      });

    return () => {
      mounted = false;
    };
  }, [navigate, redirectTo]);

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

    setError(null);
    setIsSubmitting(true);

    try {
      await loginSiteAccess(email, password);
      form.reset();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Site access login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="data-page login-page-shell">
      <div className="container login-page-container">
        <section className="login-panel" aria-labelledby="site-access-title">
          <div className="login-panel-header">
            <h1 id="site-access-title" className="login-panel-title">
              Site Access
            </h1>
            <p className="login-panel-subtitle">
              Enter the static credentials before accessing the public website.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div role="alert" className="login-alert">
                {error}
              </div>
            )}

           

            <div className="form-group login-form-group">
              <label className="form-label" htmlFor="site-access-email">
                Email <span className="required-mark">*</span>
              </label>
              <input
                id="site-access-email"
                className="form-input login-form-input"
                type="email"
                name="email"
                placeholder="Enter email"
               
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group login-form-group">
              <label className="form-label" htmlFor="site-access-password">
                Password <span className="required-mark">*</span>
              </label>
              <input
                id="site-access-password"
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
              {isSubmitting ? "Checking access..." : "Enter site"}
            </button>

           
          </form>
        </section>
      </div>
    </main>
  );
}
