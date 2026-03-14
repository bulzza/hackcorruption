import type { EducationItemInput } from "../../services/judgesService";

type RepeatableEducationProps = {
  items: EducationItemInput[];
  onChange: (items: EducationItemInput[]) => void;
  errorFor?: (path: string) => string | undefined;
};

const emptyRow = (): EducationItemInput => ({
  institution: "",
  location: "",
  year: "",
});

export default function RepeatableEducation({ items, onChange, errorFor }: RepeatableEducationProps) {
  const updateItem = (index: number, updates: Partial<EducationItemInput>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

  const addRow = () => onChange([...items, emptyRow()]);
  const removeRow = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="admin-repeatable">
      {items.length === 0 && <div className="admin-empty-inline">No education entries yet.</div>}
      {items.map((item, index) => (
        <div className="admin-repeatable-row" key={`education-${index}`}>
          <div className="admin-form-grid three">
            <label className="admin-form-field">
              <span>Institution</span>
              <input
                className="admin-input"
                value={item.institution}
                onChange={(e) => updateItem(index, { institution: e.target.value })}
                placeholder="Institution name"
              />
              {errorFor?.(`education.${index}.institution`) && (
                <span className="admin-field-error">
                  {errorFor(`education.${index}.institution`)}
                </span>
              )}
            </label>
            <label className="admin-form-field">
              <span>Location</span>
              <input
                className="admin-input"
                value={item.location}
                onChange={(e) => updateItem(index, { location: e.target.value })}
                placeholder="City, Country"
              />
            </label>
            <label className="admin-form-field">
              <span>Year</span>
              <input
                className="admin-input"
                type="number"
                value={item.year ?? ""}
                onChange={(e) => updateItem(index, { year: e.target.value })}
                placeholder="YYYY"
              />
              {errorFor?.(`education.${index}.year`) && (
                <span className="admin-field-error">{errorFor(`education.${index}.year`)}</span>
              )}
            </label>
          </div>
          <button className="admin-btn ghost" type="button" onClick={() => removeRow(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="admin-btn secondary" type="button" onClick={addRow}>
        Add education
      </button>
    </div>
  );
}
