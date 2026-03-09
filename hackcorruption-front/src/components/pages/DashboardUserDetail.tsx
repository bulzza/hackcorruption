import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { getUserById, toggleUserStatus } from "../../services/usersService";
import type { UserDetail } from "../../services/usersService";

export default function DashboardUserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setUser(null);
      setLoading(false);
      return;
    }
    getUserById(numericId)
      .then((data) => {
        if (!mounted) return;
        setUser(data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      const updated = await toggleUserStatus(user.id);
      setUser((prev) => (prev ? { ...prev, ...updated } : prev));
    } catch (err) {
      console.warn(err);
    } finally {
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading user...</div>;
  }

  if (!user) {
    return (
      <div className="admin-empty-state">
        <h2>User not found</h2>
        <p>The requested user could not be found.</p>
        <Link className="admin-btn primary" to="/dashboard/users">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard/users">Users</Link>
        <span aria-hidden="true">/</span>
        <span>{user.full_name ?? user.email}</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{user.full_name ?? "User profile"}</h1>
          <p className="admin-page-subtitle">Account details and access overview.</p>
        </div>
        <div className="admin-action-group">
          <Link className="admin-btn ghost" to="/dashboard/users">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to list
          </Link>
          <Link className="admin-btn secondary" to={`/dashboard/users/${user.id}/edit`}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M4 20H8L19 9C20.105 7.895 20.105 6.105 19 5C17.895 3.895 16.105 3.895 15 5L4 16V20Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M13 7L17 11" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Edit
          </Link>
          <button className="admin-btn danger" type="button" onClick={() => setConfirmOpen(true)}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M6 6C8.5 4 15.5 4 18 6C21 8.5 21 15.5 18 18C15.5 20 8.5 20 6 18C3 15.5 3 8.5 6 6Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="M12 7V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="admin-summary-grid">
        <div className="admin-summary-card">
          <span>Status</span>
          <strong>{user.status}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Role</span>
          <strong>{user.role ?? "Unassigned"}</strong>
        </div>
        
      </div>

      <div className="admin-detail-grid">
        <section className="admin-card">
          <div className="admin-card-header">
            <h2>User details</h2>
          </div>
          <div className="admin-card-body">
            <div className="admin-detail-list">
              <div>
                <span>Full name</span>
                <strong>{user.full_name ?? "Not provided"}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{user.role ?? "Unassigned"}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{user.status}</strong>
              </div>
              <div>
                <span>Created</span>
                <strong>{user.created_at ?? "N/A"}</strong>
              </div>
              
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Change user status?"
        message={`This will mark ${user.full_name ?? user.email} as ${
          user.status === "Active" ? "Inactive" : "Active"
        }.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
