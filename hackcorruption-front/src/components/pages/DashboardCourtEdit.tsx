import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourtById, updateCourt } from "../../services/courtsService";
import type { CourtDetail, CourtInput } from "../../services/courtsService";

export default function DashboardCourtEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [court, setCourt] = useState<CourtDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<CourtInput>>({
    name: "",
    slug: "",
    type: "",
    jurisdiction: "",
    address: "",
    phones: [],
    website: "",
    about: "",
  });

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    getCourtById(id, { includeCases: false })
      .then((data) => {
        if (!mounted) return;
        setCourt(data);
        if (data) {
          setFormData({
            name: data.name,
            slug: data.id,
            type: data.type,
            jurisdiction: data.jurisdiction,
            address: data.address,
            phones: data.phones,
            website: data.website,
            about: data.about,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!court || !id) return;
    setError("");
    setSaving(true);

    try {
      await updateCourt(id, formData);
      navigate(`/dashboard/courts/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update court");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading court...</div>;
  }

  if (!court) {
    return (
      <div className="admin-empty-state">
        <h2>Court not found</h2>
        <p>The requested court record could not be found.</p>
        <Link className="admin-btn primary" to="/dashboard/courts">
          Back to Courts
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
        <Link to="/dashboard/courts">Courts</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/dashboard/courts/${id}`}>{court.name}</Link>
        <span aria-hidden="true">/</span>
        <span>Edit</span>
      </nav>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Court</h1>
          <p className="admin-page-subtitle">Update court information.</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: "600px" }}>
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
                value={formData.name || ""}
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
                value={formData.slug || ""}
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="type">Type</label>
              <input
                id="type"
                name="type"
                type="text"
                className="admin-input"
                value={formData.type || ""}
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
                value={formData.jurisdiction || ""}
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
                value={formData.address || ""}
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
                value={formData.website || ""}
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
                value={formData.about || ""}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button type="submit" className="admin-btn primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link to={`/dashboard/courts/${id}`} className="admin-btn ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
