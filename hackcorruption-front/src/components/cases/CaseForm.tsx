import { useEffect, useMemo, useState } from "react";
import { useBlocker } from "react-router-dom";
import ConfirmDialog from "../judges/ConfirmDialog";
import RepeatableTimeline from "./RepeatableTimeline";
import type {
  CaseDetail,
  CaseInput,
  CaseTimelineItemInput,
} from "../../services/casesService";

type CaseFormProps = {
  mode: "create" | "edit";
  initialData?: CaseDetail;
  existingIds: string[];
  onSave: (payload: CaseInput) => Promise<void>;
  onCancel: () => void;
};

type ToastState = { message: string; tone: "success" | "error" };

const emptyCase = (): CaseInput => ({
  id: "",
  court: "",
  judge: "",
  decision_date: "",
  legal_area: "",
  summary: "",
  case_detail: {
    case_type: "",
    case_subtype: "",
    basis_type: "",
    basis: "",
    articles: "",
    public_prosecutor_case: "",
  },
  case_financials: {
    case_cost: "",
    total_case_cost: "",
  },
  case_insights: {
    mitigating_factors: "",
    plea_deal: "",
    duration_days: "",
    severity_ratio: "",
    sentence_severity: "",
    appeal: "",
  },
  case_timeline: [],
});

const toInput = (item: CaseDetail): CaseInput => ({
  id: item.id ?? "",
  court: item.court ?? "",
  judge: item.judge ?? "",
  decision_date: item.decision_date ?? "",
  legal_area: item.legal_area ?? "",
  summary: item.summary ?? "",
  case_detail: {
    case_type: item.case_detail.case_type ?? "",
    case_subtype: item.case_detail.case_subtype ?? "",
    basis_type: item.case_detail.basis_type ?? "",
    basis: item.case_detail.basis ?? "",
    articles: item.case_detail.articles ?? "",
    public_prosecutor_case: item.case_detail.public_prosecutor_case ?? "",
  },
  case_financials: {
    case_cost: item.case_financials.case_cost ?? "",
    total_case_cost: item.case_financials.total_case_cost ?? "",
  },
  case_insights: {
    mitigating_factors: item.case_insights.mitigating_factors ?? "",
    plea_deal: item.case_insights.plea_deal ?? "",
    duration_days: item.case_insights.duration_days ?? "",
    severity_ratio: item.case_insights.severity_ratio ?? "",
    sentence_severity: item.case_insights.sentence_severity ?? "",
    appeal: item.case_insights.appeal ?? "",
  },
  case_timeline: item.case_timeline.map((event) => ({
    event_name: event.event_name ?? "",
    event_date: event.event_date ?? "",
  })),
});

const sanitizeDecimal = (value: string) => value.replace(/[^0-9.]/g, "");
const sanitizeInteger = (value: string) => value.replace(/[^0-9]/g, "");

export default function CaseForm({
  mode,
  initialData,
  existingIds,
  onSave,
  onCancel,
}: CaseFormProps) {
  const [form, setForm] = useState<CaseInput>(() =>
    initialData ? toInput(initialData) : emptyCase()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [openSection, setOpenSection] = useState("case");
  const [leaveOpen, setLeaveOpen] = useState(false);

  const blocker = useBlocker(isDirty);
  const initialId = initialData?.id ?? "";

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

  const handleCaseChange = (field: keyof CaseInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleDetailChange = (
    field: keyof CaseInput["case_detail"],
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      case_detail: { ...prev.case_detail, [field]: value },
    }));
    setIsDirty(true);
  };

  const handleFinancialChange = (
    field: keyof CaseInput["case_financials"],
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      case_financials: { ...prev.case_financials, [field]: sanitizeDecimal(value) },
    }));
    setIsDirty(true);
  };

  const handleInsightsChange = (
    field: keyof CaseInput["case_insights"],
    value: string
  ) => {
    const sanitized =
      field === "duration_days"
        ? sanitizeInteger(value)
        : field === "severity_ratio"
        ? sanitizeDecimal(value)
        : value;
    setForm((prev) => ({
      ...prev,
      case_insights: { ...prev.case_insights, [field]: sanitized },
    }));
    setIsDirty(true);
  };

  const isValidNumber = (value: string | number) =>
    value !== "" && !Number.isNaN(Number(value));

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const idValue = form.id.trim();
    const normalizedId = idValue.toLowerCase();
    const existing = existingIds.map((item) => item.trim().toLowerCase());
    if (!idValue) nextErrors.id = "Case ID is required.";
    if (idValue && existing.includes(normalizedId) && normalizedId !== initialId.toLowerCase()) {
      nextErrors.id = "Case ID must be unique.";
    }
    if (!form.court.trim()) nextErrors.court = "Court is required.";
    if (!form.judge.trim()) nextErrors.judge = "Judge is required.";
    if (!form.decision_date) nextErrors.decision_date = "Decision date is required.";
    if (!form.legal_area.trim()) nextErrors.legal_area = "Legal area is required.";
    if (!form.summary.trim()) nextErrors.summary = "Summary is required.";

    const numericFields: Array<keyof CaseInput["case_financials"]> = [
      "case_cost",
      "total_case_cost",
    ];
    numericFields.forEach((field) => {
      const value = form.case_financials[field];
      if (value !== "" && !isValidNumber(value)) {
        nextErrors[`case_financials.${field}`] = "Numbers only.";
      }
    });

    if (form.case_insights.duration_days !== "" && !isValidNumber(form.case_insights.duration_days)) {
      nextErrors["case_insights.duration_days"] = "Numbers only.";
    }
    if (
      form.case_insights.severity_ratio !== "" &&
      !isValidNumber(form.case_insights.severity_ratio)
    ) {
      nextErrors["case_insights.severity_ratio"] = "Numbers only.";
    }

    form.case_timeline.forEach((item, index) => {
      const started = Boolean(item.event_name || item.event_date);
      if (!started) return;
      if (!item.event_name.trim()) {
        nextErrors[`case_timeline.${index}.event_name`] = "Event name is required.";
      }
      if (!item.event_date) {
        nextErrors[`case_timeline.${index}.event_date`] = "Event date is required.";
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
      await onSave(form);
      setToast({
        message: mode === "create" ? "Case created successfully." : "Case updated successfully.",
        tone: "success",
      });
      setIsDirty(false);
    } catch (err) {
      console.warn(err);
      const message = err instanceof Error ? err.message : "Failed to save case. Try again.";
      setToast({ message, tone: "error" });
      const lower = message.toLowerCase();
      if (lower.includes("id")) {
        setErrors((prev) => ({ ...prev, id: message }));
        setOpenSection("case");
      }
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

  const timelineItems = useMemo(() => form.case_timeline, [form.case_timeline]);

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
          onClick={() => setOpenSection("case")}
          aria-expanded={openSection === "case"}
        >
          <span>1) Case</span>
          <span>{openSection === "case" ? "-" : "+"}</span>
        </button>
        {openSection === "case" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid two">
              <label className="admin-form-field">
                <span>Case ID</span>
                <input
                  className="admin-input"
                  value={form.id}
                  onChange={(e) => handleCaseChange("id", e.target.value)}
                  placeholder="Case reference"
                  disabled={mode === "edit"}
                />
                {getError("id") && <span className="admin-field-error">{getError("id")}</span>}
              </label>
              <label className="admin-form-field">
                <span>Court</span>
                <input
                  className="admin-input"
                  value={form.court}
                  onChange={(e) => handleCaseChange("court", e.target.value)}
                  placeholder="Court name"
                />
                {getError("court") && (
                  <span className="admin-field-error">{getError("court")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Judge</span>
                <input
                  className="admin-input"
                  value={form.judge}
                  onChange={(e) => handleCaseChange("judge", e.target.value)}
                  placeholder="Judge name"
                />
                {getError("judge") && (
                  <span className="admin-field-error">{getError("judge")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Decision date</span>
                <input
                  className="admin-input"
                  type="date"
                  value={form.decision_date}
                  onChange={(e) => handleCaseChange("decision_date", e.target.value)}
                />
                {getError("decision_date") && (
                  <span className="admin-field-error">{getError("decision_date")}</span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Legal area</span>
                <input
                  className="admin-input"
                  value={form.legal_area}
                  onChange={(e) => handleCaseChange("legal_area", e.target.value)}
                  placeholder="Legal area"
                />
                {getError("legal_area") && (
                  <span className="admin-field-error">{getError("legal_area")}</span>
                )}
              </label>
              <label className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
                <span>Summary</span>
                <textarea
                  className="admin-input"
                  rows={4}
                  value={form.summary}
                  onChange={(e) => handleCaseChange("summary", e.target.value)}
                  placeholder="Case summary"
                />
                {getError("summary") && (
                  <span className="admin-field-error">{getError("summary")}</span>
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
          onClick={() => setOpenSection("detail")}
          aria-expanded={openSection === "detail"}
        >
          <span>2) Case detail</span>
          <span>{openSection === "detail" ? "-" : "+"}</span>
        </button>
        {openSection === "detail" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid three">
              <label className="admin-form-field">
                <span>Case type</span>
                <input
                  className="admin-input"
                  value={form.case_detail.case_type ?? ""}
                  onChange={(e) => handleDetailChange("case_type", e.target.value)}
                  placeholder="Case type"
                />
              </label>
              <label className="admin-form-field">
                <span>Case subtype</span>
                <input
                  className="admin-input"
                  value={form.case_detail.case_subtype ?? ""}
                  onChange={(e) => handleDetailChange("case_subtype", e.target.value)}
                  placeholder="Case subtype"
                />
              </label>
              <label className="admin-form-field">
                <span>Basis type</span>
                <input
                  className="admin-input"
                  value={form.case_detail.basis_type ?? ""}
                  onChange={(e) => handleDetailChange("basis_type", e.target.value)}
                  placeholder="Basis type"
                />
              </label>
              <label className="admin-form-field">
                <span>Basis</span>
                <input
                  className="admin-input"
                  value={form.case_detail.basis ?? ""}
                  onChange={(e) => handleDetailChange("basis", e.target.value)}
                  placeholder="Basis"
                />
              </label>
              <label className="admin-form-field">
                <span>Articles</span>
                <input
                  className="admin-input"
                  value={form.case_detail.articles ?? ""}
                  onChange={(e) => handleDetailChange("articles", e.target.value)}
                  placeholder="Articles"
                />
              </label>
              <label className="admin-form-field">
                <span>Public prosecutor case</span>
                <input
                  className="admin-input"
                  value={form.case_detail.public_prosecutor_case ?? ""}
                  onChange={(e) => handleDetailChange("public_prosecutor_case", e.target.value)}
                  placeholder="Reference"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("financials")}
          aria-expanded={openSection === "financials"}
        >
          <span>3) Case financials</span>
          <span>{openSection === "financials" ? "-" : "+"}</span>
        </button>
        {openSection === "financials" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid two">
              <label className="admin-form-field">
                <span>Case cost</span>
                <input
                  className="admin-input"
                  type="number"
                  value={form.case_financials.case_cost ?? ""}
                  onChange={(e) => handleFinancialChange("case_cost", e.target.value)}
                  placeholder="0.00"
                />
                {getError("case_financials.case_cost") && (
                  <span className="admin-field-error">
                    {getError("case_financials.case_cost")}
                  </span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Total case cost</span>
                <input
                  className="admin-input"
                  type="number"
                  value={form.case_financials.total_case_cost ?? ""}
                  onChange={(e) => handleFinancialChange("total_case_cost", e.target.value)}
                  placeholder="0.00"
                />
                {getError("case_financials.total_case_cost") && (
                  <span className="admin-field-error">
                    {getError("case_financials.total_case_cost")}
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
          onClick={() => setOpenSection("insights")}
          aria-expanded={openSection === "insights"}
        >
          <span>4) Case insights</span>
          <span>{openSection === "insights" ? "-" : "+"}</span>
        </button>
        {openSection === "insights" && (
          <div className="admin-accordion-panel">
            <div className="admin-form-grid three">
              <label className="admin-form-field">
                <span>Mitigating factors</span>
                <input
                  className="admin-input"
                  value={form.case_insights.mitigating_factors ?? ""}
                  onChange={(e) => handleInsightsChange("mitigating_factors", e.target.value)}
                  placeholder="Mitigating factors"
                />
              </label>
              <label className="admin-form-field">
                <span>Plea deal</span>
                <input
                  className="admin-input"
                  value={form.case_insights.plea_deal ?? ""}
                  onChange={(e) => handleInsightsChange("plea_deal", e.target.value)}
                  placeholder="Plea deal"
                />
              </label>
              <label className="admin-form-field">
                <span>Duration (days)</span>
                <input
                  className="admin-input"
                  type="number"
                  value={form.case_insights.duration_days ?? ""}
                  onChange={(e) => handleInsightsChange("duration_days", e.target.value)}
                  placeholder="0"
                />
                {getError("case_insights.duration_days") && (
                  <span className="admin-field-error">
                    {getError("case_insights.duration_days")}
                  </span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Severity ratio</span>
                <input
                  className="admin-input"
                  type="number"
                  value={form.case_insights.severity_ratio ?? ""}
                  onChange={(e) => handleInsightsChange("severity_ratio", e.target.value)}
                  placeholder="0.00"
                />
                {getError("case_insights.severity_ratio") && (
                  <span className="admin-field-error">
                    {getError("case_insights.severity_ratio")}
                  </span>
                )}
              </label>
              <label className="admin-form-field">
                <span>Sentence severity</span>
                <input
                  className="admin-input"
                  value={form.case_insights.sentence_severity ?? ""}
                  onChange={(e) => handleInsightsChange("sentence_severity", e.target.value)}
                  placeholder="Sentence severity"
                />
              </label>
              <label className="admin-form-field">
                <span>Appeal</span>
                <input
                  className="admin-input"
                  value={form.case_insights.appeal ?? ""}
                  onChange={(e) => handleInsightsChange("appeal", e.target.value)}
                  placeholder="Appeal"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="admin-accordion">
        <button
          className="admin-accordion-trigger"
          type="button"
          onClick={() => setOpenSection("timeline")}
          aria-expanded={openSection === "timeline"}
        >
          <span>5) Case timeline</span>
          <span>{openSection === "timeline" ? "-" : "+"}</span>
        </button>
        {openSection === "timeline" && (
          <div className="admin-accordion-panel">
            <RepeatableTimeline
              items={timelineItems as CaseTimelineItemInput[]}
              onChange={(items) => {
                setForm((prev) => ({ ...prev, case_timeline: items }));
                setIsDirty(true);
              }}
              errorFor={getError}
            />
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
