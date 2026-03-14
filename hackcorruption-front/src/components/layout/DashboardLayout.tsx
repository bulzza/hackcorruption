import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AUTH_LOGOUT_URL } from "../../services/apiConfig";

const navGroups = [
  {
    title: "Admin",
    items: [
      {
        label: "Judges",
        to: "/dashboard/judges",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M12 12C14.209 12 16 10.209 16 8C16 5.791 14.209 4 12 4C9.791 4 8 5.791 8 8C8 10.209 9.791 12 12 12Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M4 20C4 16.686 7.134 14 12 14C16.866 14 20 16.686 20 20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        label: "Courts",
        to: "/dashboard/courts",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M4 20H20M6 20V8L12 4L18 8V20M9 20V14H15V20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Judges",
        to: "/dashboard/judges",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M12 12C14.209 12 16 10.209 16 8C16 5.791 14.209 4 12 4C9.791 4 8 5.791 8 8C8 10.209 9.791 12 12 12Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M4 20C4 16.686 7.134 14 12 14C16.866 14 20 16.686 20 20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        label: "Cases",
        to: "/dashboard/cases",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M4 7C4 5.895 4.895 5 6 5H10L12 7H18C19.105 7 20 7.895 20 9V18C20 19.105 19.105 20 18 20H6C4.895 20 4 19.105 4 18V7Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Users",
        to: "/dashboard/users",
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M9 11C10.657 11 12 9.657 12 8C12 6.343 10.657 5 9 5C7.343 5 6 6.343 6 8C6 9.657 7.343 11 9 11Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M15 11C16.657 11 18 9.657 18 8C18 6.343 16.657 5 15 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M3.5 19C3.5 16.791 5.791 15 8.5 15H9.5C12.209 15 14.5 16.791 14.5 19"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M15.5 15H16.2C18.299 15 20 16.477 20 18.3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ),
      }
    ],
  },
  {
  title: "Utils",
  items: [
    {
      label: "Research",
      to: "/research",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.134 18 4 14.866 4 11C4 7.134 7.134 4 11 4C14.866 4 18 7.134 18 11Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      label: "News",
      to: "/news",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M4 5H20M4 9H20M4 13H14M4 17H14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      label: "Publications",
      to: "/publications",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path
            d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V20L12 16L4 20V6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ],
}

];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `dashboard-sidebar-link${isActive ? " active" : ""}`;

export default function DashboardLayout() {
  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <div className="dashboard-topbar-brand">
            <span className="dashboard-brand-mark">J</span>
            <span className="dashboard-brand-name">JusticiaAI</span>
          </div>
          <button className="dashboard-topbar-menu" type="button" aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="dashboard-topbar-search">
          <span className="dashboard-topbar-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.134 18 4 14.866 4 11C4 7.134 7.134 4 11 4C14.866 4 18 7.134 18 11Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input type="search" placeholder="Search..." aria-label="Search" />
        </div>

        <div className="dashboard-topbar-actions">
          <button className="dashboard-topbar-icon-btn" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M18 8C18 5.239 15.761 3 13 3H11C8.239 3 6 5.239 6 8V12L4 14V15H20V14L18 12V8Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 19C10.457 20.167 11.59 21 13 21C14.41 21 15.543 20.167 16 19"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <TopbarAvatar />
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-header">
            <div className="dashboard-sidebar-title">JusticiaAI</div>
            <div className="dashboard-sidebar-subtitle">Dashboard</div>
          </div>

          <nav className="dashboard-sidebar-nav">
            <NavLink className={navLinkClass} to="/dashboard" end>
              <span className="dashboard-sidebar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M3 11L12 4L21 11V20H14V14H10V20H3V11Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Dashboard
            </NavLink>
          </nav>

          {navGroups.map((group) => (
            <div className="dashboard-sidebar-group" key={group.title}>
              <div className="dashboard-sidebar-group-title">{group.title}</div>
              <div className="dashboard-sidebar-nav">
                {group.items.map((item) => (
                  <NavLink className={navLinkClass} to={item.to} key={item.label}>
                    <span className="dashboard-sidebar-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          <div className="dashboard-sidebar-support">
            <span className="dashboard-sidebar-support-title">Support</span>
            <button className="dashboard-sidebar-help" type="button">
              Help?
            </button>
          </div>
        </aside>

        <section className="dashboard-main">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

function TopbarAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [initials] = useState("AD");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(AUTH_LOGOUT_URL, { method: "POST", credentials: "include" });
    } catch (e) {
      console.warn("logout error", e);
    }
    try {
      localStorage.setItem("hc_auth_state", "logged_out");
    } catch {}
    setOpen(false);
    console.log("navigating to login");
    navigate("/login");
  };

  return (
    <div
      className="dashboard-topbar-avatar-wrap"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <button
        className="dashboard-topbar-avatar"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {initials}
      </button>
      {open && (
        <div
          className="dashboard-avatar-dropdown"
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            zIndex: 40,
          }}
        >
          <Link
            to="/profile"
            className="dropdown-item"
            onClick={() => setOpen(false)}
            style={{ display: "block", padding: "8px 12px" }}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="dropdown-item"
            style={{
              display: "block",
              padding: "8px 12px",
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
