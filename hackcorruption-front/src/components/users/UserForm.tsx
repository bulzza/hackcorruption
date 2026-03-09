import { useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";
import ConfirmDialog from "../judges/ConfirmDialog";
import type { UserDetail, UserInput, UserStatus } from "../../services/usersService";

type UserFormProps = {
  mode: "create" | "edit";
  initialData?: UserDetail;
  existingEmails: string[];
  onSave: (payload: UserInput) => Promise<void>;
  onCancel: () => void;
};

type ToastState = { message: string; tone: "success" | "error" };

const roleOptions = ["admin", "editor", "analyst", "viewer"];

const emptyUser = (): UserInput => ({
  full_name: "",
  email: "",
  role: "admin",
  password: "",
  status: "Active",
});

const toInput = (user: UserDetail): UserInput => ({
  full_name: user.full_name ?? "",
  email: user.email ?? "",
  role: user.role ?? "admin",
  password: "",
  status: user.status ?? "Active",
});

export default function UserForm({
  mode,
  initialData,
  existingEmails,
  onSave,
  onCancel,
}: UserFormProps) {
  const [form, setForm] = useState<UserInput>(() =>
    initialData ? toInput(initialData) : emptyUser()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [openSection, setOpenSection] = useState("user");
  const [leaveOpen, setLeaveOpen] = useState(false);

  const blocker = useBlocker(isDirty);
  const initialEmail = initialData?.email ?? "";

  useEffect(() => {
    if (blocker.state === "blocked") {
      setLeaveOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const getError = (path: string) => errors[path];

  const handleChange = (field: keyof UserInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const isEmail = (value: string) => /.+@.+\..+/.test(value.trim());

  const normalizeStatus = (value: string): UserStatus =>
    value === "Inactive" ? "Inactive" : "Active";

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const emailValue = form.email.trim().toLowerCase();
    const existingLower = existingEmails.map((item) => item.trim().toLowerCase());

    if (!form.full_name.trim()) nextErrors.full_name = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (form.email && !isEmail(form.email)) nextErrors.email = "Enter a valid email.";
    if (
      emailValue &&
      existingLower.includes(emailValue) &&
      emailValue !== initialEmail.trim().toLowerCase()
    ) {
      nextErrors.email = "Email must be unique.";
    }
    if (!form.role.trim()) nextErrors.role = "Role is required.";
    if (mode === "create" && !form.password?.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      setToast({ message: "Fix the highlighted fields before saving.", tone: "error" });
      return;
    }
    setSaving(true);
    try {
      const payload: UserInput = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        status: normalizeStatus(form.status ?? "Active"),
      };
      if (form.password?.trim()) {
        payload.password = form.password.trim();
      }
      await onSave(payload);
      setToast({
        message: mode === "create" ? "User created successfully." : "User updated successfully.",
        tone: "success",
      });
      setIsDirty(false);
    } catch (err) {
      console.warn(err);
      const message = err instanceof Error ? err.message : "Failed to save user. Try again.";
      setToast({ message, tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLeave = () => {
    setLeaveOpen(false);
    if (blocker.state === "blocked") blocker.proceed();
  };

  const handleStay = () => {
    setLeaveOpen(false);
    if (blocker.state === "blocked") blocker.reset();
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {toast && (
        <div className={`admin-toast ${toast.tone}`} role="status">
          {toast.message}
        </div>
      )}

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("user")}
          aria-expanded={openSection === "user"}
        >
          <span>1) User</span>
          <span>{openSection === "user" ? "-" : "+"}</span>
        </button>
        {openSection === "user" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid two">
              <label className="admin-form-field">
                <span>Full name</span>
                <input
                  className="admin-input"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder="Full name"
                />
                {getError("full_name") && (
                  <span className="admin-field-error">{getError("full_name")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Email</span>
                <input
                  className="admin-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="name@example.com"
                />
                {getError("email") && (
                  <span className="admin-field-error">{getError("email")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Role</span>
                <select
                  className="admin-input"
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {getError("role") && <span className="admin-field-error">{getError("role")}</span>}
              </label>
              <label className="admin-form-field">
                <span>Status</span>
                <select
                  className="admin-input"
                  value={form.status ?? "Active"}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
                <span>Password {mode === "edit" ? "(leave blank to keep)" : ""}</span>
                <input
                  className="admin-input"
                  type="password"
                  value={form.password ?? ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={mode === "edit" ? "Leave blank to keep current password" : "Password"}
                />
                {getError("password") && (
                  <span className="admin-field-error">{getError("password")}</span>
                )}
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="admin-form-footer">
        <button className="admin-btn ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="admin-btn primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <ConfirmDialog
        open={leaveOpen}
        title="Leave without saving?"
        message="You have unsaved changes. Are you sure you want to leave this form?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        tone="danger"
        onConfirm={handleLeave}
        onCancel={handleStay}
      />
    </form>
  );
}
