import "./../../styles/landing.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/useI18n";
import type { Lang } from "../../i18n/useI18n";
import { useEffect, useState } from "react";
import { AUTH_ME_URL } from "../../services/apiConfig";
import { getSiteAccessSession, logoutSiteAccess } from "../../services/siteAccessService";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? " active" : ""}`;

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isDataActive = location.pathname.startsWith("/data");
  const dataLinkClass = `nav-link${isDataActive ? " active" : ""}`;

  const [user, setUser] = useState<{ id: number; full_name?: string; email?: string } | null>(null);
  const [hasSiteAccess, setHasSiteAccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const set = (l: Lang) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLang(l);
  };

  useEffect(() => {
    let mounted = true;
    fetch(AUTH_ME_URL, { credentials: 'include' })
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        if (!mounted) return;
        if (data && data.ok && data.user) setUser(data.user);
      })
      .catch(() => {});
    getSiteAccessSession()
      .then((data) => {
        if (!mounted) return;
        setHasSiteAccess(Boolean(data?.ok));
      })
      .catch(() => {
        if (!mounted) return;
        setHasSiteAccess(false);
      });
    return () => { mounted = false };
  }, []);

  const handleSiteLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logoutSiteAccess();
    setHasSiteAccess(false);
    navigate("/site-access", { replace: true });
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          JusticiaAI
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={navLinkClass}>
            {t("nav_about")}
          </NavLink>
          <NavLink to="/data/courts" className={dataLinkClass}>
            {t("nav_data")}
          </NavLink>
          
          <NavLink to="/research" className={navLinkClass}>
            {t("nav_research")}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t("nav_contact")}
          </NavLink>
          {user ? (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              {t("nav_login")}
            </NavLink>
          )}
        </nav>

        <div className="header-utilities">
          <div className="language-selector">
            <a href="#" onClick={set("MK")} className={`lang-link ${lang === "MK" ? "active" : ""}`}>
              MK
            </a>
            <span className="lang-separator">|</span>
            <a href="#" onClick={set("AL")} className={`lang-link ${lang === "AL" ? "active" : ""}`}>
              AL
            </a>
            <span className="lang-separator">|</span>
            <a href="#" onClick={set("EN")} className={`lang-link ${lang === "EN" ? "active" : ""}`}>
              EN
            </a>
          </div>

          {hasSiteAccess && (
            <button
              type="button"
              className="site-access-logout"
              onClick={handleSiteLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Exiting..." : "Exit Site"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
