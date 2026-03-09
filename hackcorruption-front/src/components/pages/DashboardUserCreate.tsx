import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserForm from "../users/UserForm";
import { createUser, listUsers } from "../../services/usersService";
import type { UserInput } from "../../services/usersService";

export default function DashboardUserCreate() {
  const navigate = useNavigate();
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listUsers()
      .then((data) => {
        if (!mounted) return;
        setExistingEmails(data.map((user) => user.email));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading form...</div>;
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
        <span>Add User</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Add User</h1>
          <p className="admin-page-subtitle">Create an account and assign access.</p>
        </div>
      </div>

      <UserForm
        mode="create"
        existingEmails={existingEmails}
        onSave={async (payload: UserInput) => {
          const created = await createUser(payload);
          setExistingEmails((prev) =>
            prev.includes(created.email) ? prev : [...prev, created.email]
          );
          navigate(`/dashboard/users/${created.id}`);
        }}
        onCancel={() => navigate("/dashboard/users")}
      />
    </div>
  );
}
