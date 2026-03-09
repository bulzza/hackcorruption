import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserForm from "../users/UserForm";
import { getUserById, listUsers, updateUser } from "../../services/usersService";
import type { UserDetail, UserInput } from "../../services/usersService";

export default function DashboardUserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setUser(null);
      setLoading(false);
      return;
    }
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setUser(null);
      setLoading(false);
      return;
    }
    Promise.all([getUserById(numericId), listUsers()])
      .then(([detail, list]) => {
        if (!mounted) return;
        setUser(detail ?? null);
        setExistingEmails(list.map((item) => item.email));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="admin-loading">Loading form...</div>;
  }

  if (!user) {
    return (
      <div className="admin-empty-state">
        <h2>User not found</h2>
        <p>The user you are trying to edit does not exist.</p>
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
        <Link to={`/dashboard/users/${user.id}`}>{user.full_name ?? user.email}</Link>
        <span aria-hidden="true">/</span>
        <span>Edit</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit User</h1>
          <p className="admin-page-subtitle">Update account details, role, and status.</p>
        </div>
      </div>

      <UserForm
        mode="edit"
        initialData={user}
        existingEmails={existingEmails}
        onSave={async (payload: UserInput) => {
          const updated = await updateUser(user.id, payload);
          setUser(updated);
          setExistingEmails((prev) => {
            const filtered = prev.filter((item) => item !== user.email);
            return filtered.includes(updated.email) ? filtered : [...filtered, updated.email];
          });
          navigate(`/dashboard/users/${updated.id}`);
        }}
        onCancel={() => navigate(`/dashboard/users/${user.id}`)}
      />
    </div>
  );
}
