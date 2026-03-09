import type { CaseItem } from "../../services/judgesService";

type RepeatableCasesProps = {
  items: CaseItem[];
  onChange: (items: CaseItem[]) => void;
  errorFor?: (path: string) => string | undefined;
};

const emptyRow = (): CaseItem => ({
  case_id: "",
  court: "",
  type: "",
  subtype: "",
  basis_type: "",
  filing_date: "",
  status: "Open",
});

const caseStatuses = ["Open", "Pending", "Under Investigation", "Closed", "On Appeal"];

export default function RepeatableCases({ items, onChange, errorFor }: RepeatableCasesProps) {
  const updateItem = (index: number, updates: Partial<CaseItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

  const addRow = () => onChange([...items, emptyRow()]);
  const removeRow = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="admin-repeatable">
      {items.length === 0 && <div className="admin-empty-inline">No cases assigned yet.</div>}
      {items.map((item, index) => (
        <div className="admin-repeatable-row" key={`case-${index}`}>
          <div className="admin-form-grid four">
            <label className="admin-form-field">
              <span>Case ID</span>
              <input
                className="admin-input"
                value={item.case_id}
                onChange={(e) => updateItem(index, { case_id: e.target.value })}
                placeholder="Case reference"
              />
              {errorFor?.(`cases.${index}.case_id`) && (
                <span className="admin-field-error">{errorFor(`cases.${index}.case_id`)}</span>
              )}
            </label>
            <label className="admin-form-field">
              <span>Court</span>
              <input
                className="admin-input"
                value={item.court}
                onChange={(e) => updateItem(index, { court: e.target.value })}
                placeholder="Court"
              />
            </label>
            <label className="admin-form-field">
              <span>Type</span>
              <input
                className="admin-input"
                value={item.type}
                onChange={(e) => updateItem(index, { type: e.target.value })}
                placeholder="Type"
              />
            </label>
            <label className="admin-form-field">
              <span>Subtype</span>
              <input
                className="admin-input"
                value={item.subtype}
                onChange={(e) => updateItem(index, { subtype: e.target.value })}
                placeholder="Subtype"
              />
            </label>
            <label className="admin-form-field">
              <span>Basis type</span>
              <input
                className="admin-input"
                value={item.basis_type}
                onChange={(e) => updateItem(index, { basis_type: e.target.value })}
                placeholder="Basis"
              />
            </label>
            <label className="admin-form-field">
              <span>Filing date</span>
              <input
                className="admin-input"
                type="date"
                value={item.filing_date}
                onChange={(e) => updateItem(index, { filing_date: e.target.value })}
              />
              {errorFor?.(`cases.${index}.filing_date`) && (
                <span className="admin-field-error">{errorFor(`cases.${index}.filing_date`)}</span>
              )}
            </label>
            <label className="admin-form-field">
              <span>Status</span>
              <select
                className="admin-input"
                value={item.status}
                onChange={(e) => updateItem(index, { status: e.target.value })}
              >
                {caseStatuses.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button className="admin-btn ghost" type="button" onClick={() => removeRow(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="admin-btn secondary" type="button" onClick={addRow}>
        Add case
      </button>
    </div>
  );
}
