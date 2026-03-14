import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createCourt } from "../../services/courtsService";
import type { CourtInput } from "../../services/courtsService";

export default function DashboardCourtCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CourtInput>({
    name: "",
    slug: "",
    type: "",
    jurisdiction: "",
    address: "",
    phones: [],
    website: "",
    about: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createCourt(formData);
      navigate("/dashboard/courts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard">Dashboard</Link>
        <span aria-hidden="true">/</span>
        <Link to="/dashboard/courts">Courts</Link>
        <span aria-hidden="true">/</span>
        <span>New Court</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Create New Court</h1>
          <p className="admin-page-subtitle">Add a new court to the system.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          {error && (
            <div style={{ color: "#dc2626", marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fee2e2", borderRadius: "0.375rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-field">
              <label htmlFor="name">Court Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="admin-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                className="admin-input"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="type">Type</label>
              <input
                id="type"
                name="type"
                type="text"
                className="admin-input"
                value={formData.type}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="jurisdiction">Jurisdiction</label>
              <input
                id="jurisdiction"
                name="jurisdiction"
                type="text"
                className="admin-input"
                value={formData.jurisdiction}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className="admin-input"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="url"
                className="admin-input"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                className="admin-input"
                rows={4}
                value={formData.about}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button type="submit" className="admin-btn primary" disabled={loading}>
                {loading ? "Creating..." : "Create Court"}
              </button>
              <Link to="/dashboard/courts" className="admin-btn ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
