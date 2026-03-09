import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../judges/ConfirmDialog";
import { listUsers, toggleUserStatus } from "../../services/usersService";
import type { User } from "../../services/usersService";

const pageSize = 6;

export default function DashboardUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    listUsers()
      .then((data) => {
        if (!mounted) return;
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, roleFilter]);

  const roles = useMemo(() => {
    const values = new Set(
      users
        .map((item) => (item.role ?? "Unassigned").trim())
        .filter((value) => value.length > 0)
    );
    return ["All", ...Array.from(values).sort()];
  }, [users]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const name = user.full_name ?? "";
      const role = user.role ?? "Unassigned";
      const matchesQuery =
        !query ||
        name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" ? true : user.status === statusFilter;
      const matchesRole = roleFilter === "All" ? true : role === roleFilter;
      return matchesQuery && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleToggleStatus = async () => {
    if (!confirmTarget) return;
    try {
      const updated = await toggleUserStatus(confirmTarget.id);
      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
    } catch (err) {
      console.warn(err);
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <span>Users</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">Manage access, roles, and account status.</p>
        </div>
        <Link className="admin-btn primary" to="/dashboard/users/new">
          Add User
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <label className="admin-form-field">
            <span>Search</span>
            <input
              className="admin-input"
              type="search"
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="admin-form-field">
            <span>Status</span>
            <select
              className="admin-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <label className="admin-form-field">
            <span>Role</span>
            <select
              className="admin-input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No users found</h3>
            <p>Try adjusting your search or filters, or add a new user.</p>
            <Link className="admin-btn primary" to="/dashboard/users/new">
              Add User
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-strong">{user.full_name ?? "Unnamed user"}</td>
                    <td className="admin-code">{user.email}</td>
                    <td>{user.role ?? "Unassigned"}</td>
                    <td>
                      <span
                        className={`admin-status-badge ${
                          user.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    
                    <td>
                      <div className="admin-action-group">
                        <Link className="admin-btn ghost" to={`/dashboard/users/${user.id}`}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                            <path
                              d="M2 12C4.5 7 8 5 12 5C16 5 19.5 7 22 12C19.5 17 16 19 12 19C8 19 4.5 17 2 12Z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinejoin="round"
                            />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
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
                        </Link>
                        <button
                          className="admin-btn danger"
                          type="button"
                          onClick={() => setConfirmTarget(user)}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                            <path
                              d="M6 6C8.5 4 15.5 4 18 6C21 8.5 21 15.5 18 18C15.5 20 8.5 20 6 18C3 15.5 3 8.5 6 6Z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M12 7V12"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="admin-pagination">
          <button
            className="admin-btn ghost"
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="admin-btn ghost"
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Change user status?"
        message={`This will mark ${confirmTarget?.full_name ?? "this user"} as ${
          confirmTarget?.status === "Active" ? "Inactive" : "Active"
        }.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
