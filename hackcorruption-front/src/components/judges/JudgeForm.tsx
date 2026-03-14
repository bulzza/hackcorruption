import { useEffect, useMemo, useState } from "react";
import { useBlocker } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import RepeatableEducation from "./RepeatableEducation";
import RepeatableExperience from "./RepeatableExperience";
import RepeatableCases from "./RepeatableCases";
import type {
  CaseItem,
  EducationItemInput,
  ExperienceItemInput,
  JudgeDetail,
  JudgeInput,
  MetricsInput,
} from "../../services/judgesService";

type JudgeFormProps = {
  mode: "create" | "edit";
  initialData?: JudgeDetail;
  existingSlugs: string[];
  onSave: (payload: JudgeInput, photoFile: File | null) => Promise<void>;
  onCancel: () => void;
};

type ToastState = { message: string; tone: "success" | "error" };

const MAX_PHOTO_BYTES = 40 * 1024 * 1024;
const MAX_PHOTO_LABEL = "40 MB";

const emptyMetrics = (): MetricsInput => ({
  avg_duration_days: "",
  clearance_rate_percent: "",
  total_solved: "",
  active_cases: "",
  sentence_severity: "",
  appeal_reversal_percent: "",
});

const emptyJudge = (): JudgeInput => ({
  slug: "",
  full_name: "",
  year_of_election: "",
  area_of_work: "",
  photoUrl: "",
  education: [],
  experience: [],
  metrics: emptyMetrics(),
  cases: [],
});

const toInput = (judge: JudgeDetail): JudgeInput => ({
  slug: judge.slug,
  full_name: judge.full_name,
  year_of_election: judge.year_of_election ?? "",
  area_of_work: judge.area_of_work ?? "",
  photoUrl: judge.photoUrl ?? "",
  education: judge.education.map((item) => ({
    institution: item.institution,
    location: item.location,
    year: item.year ?? "",
  })),
  experience: judge.experience.map((item) => ({
    title: item.title,
    position: item.position,
    start_year: item.start_year ?? "",
    end_year: item.is_current ? "" : item.end_year ?? "",
    is_current: item.is_current,
  })),
  metrics: {
    avg_duration_days: judge.metrics.avg_duration_days,
    clearance_rate_percent: judge.metrics.clearance_rate_percent,
    total_solved: judge.metrics.total_solved,
    active_cases: judge.metrics.active_cases,
    sentence_severity: judge.metrics.sentence_severity,
    appeal_reversal_percent: judge.metrics.appeal_reversal_percent,
  },
  cases: judge.cases.map((item) => ({ ...item })),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sanitizeSlug = (value: string) => slugify(value);

const sanitizeNumber = (value: string) => value.replace(/%/g, "").replace(/[^0-9.]/g, "");

export default function JudgeForm({
  mode,
  initialData,
  existingSlugs,
  onSave,
  onCancel,
}: JudgeFormProps) {
  const [form, setForm] = useState<JudgeInput>(() =>
    initialData ? toInput(initialData) : emptyJudge()
  );
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [openSection, setOpenSection] = useState("judge");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(
    initialData?.photoUrl ?? undefined
  );
  const [leaveOpen, setLeaveOpen] = useState(false);

  const blocker = useBlocker(isDirty);
  const initialSlug = initialData?.slug ?? "";

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

  const handlePhotoChange = (file: File | null) => {
    if (file && file.size > MAX_PHOTO_BYTES) {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
      setErrors((prev) => ({
        ...prev,
        photo: `Photo must be ${MAX_PHOTO_LABEL} or less.`,
      }));
      setPhotoFile(null);
      setPhotoPreview(initialData?.photoUrl ?? undefined);
      setIsDirty(true);
      return;
    }
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(initialData?.photoUrl ?? undefined);
    }
    setErrors((prev) => {
      if (!prev.photo) return prev;
      const { photo, ...rest } = prev;
      return rest;
    });
    setPhotoFile(file);
    setIsDirty(true);
  };

  const handleBasicChange = (field: keyof JudgeInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleFullNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      full_name: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
    setIsDirty(true);
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: sanitizeSlug(value) }));
    setIsDirty(true);
  };

  const handleMetricsChange = (field: keyof MetricsInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      metrics: { ...prev.metrics, [field]: sanitizeNumber(value) },
    }));
    setIsDirty(true);
  };

  const isValidNumber = (value: string | number) =>
    value !== "" && !Number.isNaN(Number(value));

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const slugValue = form.slug.trim();
    if (!slugValue) nextErrors.slug = "Slug is required.";
    if (slugValue && !/^[a-z0-9-]+$/.test(slugValue)) {
      nextErrors.slug = "Slug must be lowercase letters, numbers, and hyphens only.";
    }
    if (slugValue && existingSlugs.includes(slugValue) && slugValue !== initialSlug) {
      nextErrors.slug = "Slug must be unique.";
    }
    if (!form.full_name.trim()) nextErrors.full_name = "Full name is required.";
    if (!form.year_of_election || !isValidNumber(form.year_of_election)) {
      nextErrors.year_of_election = "Year of election is required.";
    }
    if (!form.area_of_work.trim()) nextErrors.area_of_work = "Area of work is required.";
    if (photoFile && photoFile.size > MAX_PHOTO_BYTES) {
      nextErrors.photo = `Photo must be ${MAX_PHOTO_LABEL} or less.`;
    }

    const percentFields: Array<keyof MetricsInput> = [
      "avg_duration_days",
      "clearance_rate_percent",
      "total_solved",
      "active_cases",
      "sentence_severity",
      "appeal_reversal_percent",
    ];
    percentFields.forEach((field) => {
      const value = form.metrics[field];
      if (value !== "" && Number.isNaN(Number(value))) {
        nextErrors[`metrics.${field}`] = "Numbers only.";
      }
    });

    form.education.forEach((item, index) => {
      const started = Boolean(item.institution || item.location || item.year);
      if (!started) return;
      if (!item.institution.trim()) {
        nextErrors[`education.${index}.institution`] = "Institution is required.";
      }
      if (!item.year || Number.isNaN(Number(item.year))) {
        nextErrors[`education.${index}.year`] = "Year is required.";
      }
    });

    form.experience.forEach((item, index) => {
      const started = Boolean(
        item.title || item.position || item.start_year || item.end_year || item.is_current
      );
      if (!started) return;
      if (!item.title.trim()) {
        nextErrors[`experience.${index}.title`] = "Title is required.";
      }
      if (!item.start_year || Number.isNaN(Number(item.start_year))) {
        nextErrors[`experience.${index}.start_year`] = "Start year is required.";
      }
    });

    form.cases.forEach((item, index) => {
      const started = Boolean(
        item.case_id ||
          item.court ||
          item.type ||
          item.subtype ||
          item.basis_type ||
          item.filing_date ||
          item.status
      );
      if (!started) return;
      if (!item.case_id.trim()) {
        nextErrors[`cases.${index}.case_id`] = "Case ID is required.";
      }
      if (!item.filing_date) {
        nextErrors[`cases.${index}.filing_date`] = "Filing date is required.";
      }
    });

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
      await onSave(form, photoFile);
      setToast({
        message: mode === "create" ? "Judge created successfully." : "Judge updated successfully.",
        tone: "success",
      });
      setIsDirty(false);
    } catch (err) {
      console.warn(err);
      const message =
        err instanceof Error ? err.message : "Failed to save judge. Try again.";
      setToast({ message, tone: "error" });
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("slug")) {
        setErrors((prev) => ({ ...prev, slug: message }));
        setOpenSection("judge");
      }
      if (
        lowerMessage.includes("photo") &&
        (lowerMessage.includes("large") ||
          lowerMessage.includes("size") ||
          lowerMessage.includes("upload") ||
          lowerMessage.includes("big"))
      ) {
        setErrors((prev) => ({ ...prev, photo: message }));
        setOpenSection("judge");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleLeave = () => {
    setLeaveOpen(false);
    if (blocker.state === "blocked") blocker.proceed();
  };

  const handleStay = () => {
    setLeaveOpen(false);
    if (blocker.state === "blocked") blocker.reset();
  };

  const educationItems = useMemo(() => form.education, [form.education]);
  const experienceItems = useMemo(() => form.experience, [form.experience]);
  const caseItems = useMemo(() => form.cases, [form.cases]);

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
          onClick={() => setOpenSection("judge")}
          aria-expanded={openSection === "judge"}
        >
          <span>1) Judge</span>
          <span>{openSection === "judge" ? "-" : "+"}</span>
        </button>
        {openSection === "judge" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid two">
              <label className="admin-form-field">
                <span>Full name</span>
                <input
                  className="admin-input"
                  value={form.full_name}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="Judge full name"
                />
                {getError("full_name") && <span className="admin-field-error">{getError("full_name")}</span>}
              </label>
              <label className="admin-form-field">
                <span>Slug</span>
                <input
                  className="admin-input"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="auto-generated-slug"
                />
                <span className="admin-field-helper">Auto-generated from full name unless you edit it.</span>
                {getError("slug") && <span className="admin-field-error">{getError("slug")}</span>}
              </label>
              <label className="admin-form-field">
                <span>Year of election</span>
                <input
                  className="admin-input"
                  type="number"
                  value={form.year_of_election ?? ""}
                  onChange={(e) => handleBasicChange("year_of_election", e.target.value)}
                  placeholder="YYYY"
                />
                {getError("year_of_election") && (
                  <span className="admin-field-error">{getError("year_of_election")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Area of work</span>
                <input
                  className="admin-input"
                  value={form.area_of_work}
                  onChange={(e) => handleBasicChange("area_of_work", e.target.value)}
                  placeholder="Specialization"
                />
                {getError("area_of_work") && (
                  <span className="admin-field-error">{getError("area_of_work")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Photo upload</span>
                <input
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
                />
                {getError("photo") && <span className="admin-field-error">{getError("photo")}</span>}
                {photoPreview && (
                  <div className="admin-photo-preview">
                    <img src={photoPreview} alt="Judge preview" />
                    <button className="admin-btn ghost" type="button" onClick={() => handlePhotoChange(null)}>
                      Clear photo
                    </button>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("education")}
          aria-expanded={openSection === "education"}
        >
          <span>2) Education</span>
          <span>{openSection === "education" ? "-" : "+"}</span>
        </button>
        {openSection === "education" && (
          <div className="admin-accordion-panel">
            <RepeatableEducation
              items={educationItems as EducationItemInput[]}
              onChange={(items) => {
                setForm((prev) => ({ ...prev, education: items }));
                setIsDirty(true);
              }}
              errorFor={getError}
            />
          </div>
        )}
      </div>

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("experience")}
          aria-expanded={openSection === "experience"}
        >
          <span>3) Experience</span>
          <span>{openSection === "experience" ? "-" : "+"}</span>
        </button>
        {openSection === "experience" && (
          <div className="admin-accordion-panel">
            <RepeatableExperience
              items={experienceItems as ExperienceItemInput[]}
              onChange={(items) => {
                setForm((prev) => ({ ...prev, experience: items }));
                setIsDirty(true);
              }}
              errorFor={getError}
            />
          </div>
        )}
      </div>

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("metrics")}
          aria-expanded={openSection === "metrics"}
        >
          <span>4) Metrics</span>
          <span>{openSection === "metrics" ? "-" : "+"}</span>
        </button>
        {openSection === "metrics" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid three">
              <label className="admin-form-field">
                <span>Avg duration (days)</span>
                <input
                  className="admin-input"
                  value={form.metrics.avg_duration_days}
                  onChange={(e) => handleMetricsChange("avg_duration_days", e.target.value)}
                />
                {getError("metrics.avg_duration_days") && (
                  <span className="admin-field-error">{getError("metrics.avg_duration_days")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Clearance rate (%)</span>
                <input
                  className="admin-input"
                  value={form.metrics.clearance_rate_percent}
                  onChange={(e) => handleMetricsChange("clearance_rate_percent", e.target.value)}
                />
                {getError("metrics.clearance_rate_percent") && (
                  <span className="admin-field-error">
                    {getError("metrics.clearance_rate_percent")}
                  </span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Total solved</span>
                <input
                  className="admin-input"
                  value={form.metrics.total_solved}
                  onChange={(e) => handleMetricsChange("total_solved", e.target.value)}
                />
                {getError("metrics.total_solved") && (
                  <span className="admin-field-error">{getError("metrics.total_solved")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Active cases</span>
                <input
                  className="admin-input"
                  value={form.metrics.active_cases}
                  onChange={(e) => handleMetricsChange("active_cases", e.target.value)}
                />
                {getError("metrics.active_cases") && (
                  <span className="admin-field-error">{getError("metrics.active_cases")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Sentence severity</span>
                <input
                  className="admin-input"
                  value={form.metrics.sentence_severity}
                  onChange={(e) => handleMetricsChange("sentence_severity", e.target.value)}
                />
                {getError("metrics.sentence_severity") && (
                  <span className="admin-field-error">{getError("metrics.sentence_severity")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Appeal reversal (%)</span>
                <input
                  className="admin-input"
                  value={form.metrics.appeal_reversal_percent}
                  onChange={(e) => handleMetricsChange("appeal_reversal_percent", e.target.value)}
                />
                {getError("metrics.appeal_reversal_percent") && (
                  <span className="admin-field-error">
                    {getError("metrics.appeal_reversal_percent")}
                  </span>
                )}
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("cases")}
          aria-expanded={openSection === "cases"}
        >
          <span>5) Cases</span>
          <span>{openSection === "cases" ? "-" : "+"}</span>
        </button>
        {openSection === "cases" && (
          <div className="admin-accordion-panel">
            <RepeatableCases
              items={caseItems as CaseItem[]}
              onChange={(items) => {
                setForm((prev) => ({ ...prev, cases: items }));
                setIsDirty(true);
              }}
              errorFor={getError}
            />
          </div>
        )}
      </div>

      <div className="admin-form-footer">
        <button className="admin-btn ghost" type="button" onClick={handleCancel}>
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
