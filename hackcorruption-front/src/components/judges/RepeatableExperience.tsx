import type { ExperienceItemInput } from "../../services/judgesService";

type RepeatableExperienceProps = {
  items: ExperienceItemInput[];
  onChange: (items: ExperienceItemInput[]) => void;
  errorFor?: (path: string) => string | undefined;
};

const emptyRow = (): ExperienceItemInput => ({
  title: "",
  position: "",
  start_year: "",
  end_year: "",
  is_current: false,
});

export default function RepeatableExperience({ items, onChange, errorFor }: RepeatableExperienceProps) {
  const updateItem = (index: number, updates: Partial<ExperienceItemInput>) => {
    const next = items.map((item, i) => {
      if (i !== index) return item;
      const updated = { ...item, ...updates };
      if (updated.is_current) {
        updated.end_year = "";
      }
      return updated;
    });
    onChange(next);
  };

  const addRow = () => onChange([...items, emptyRow()]);
  const removeRow = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="admin-repeatable">
      {items.length === 0 && <div className="admin-empty-inline">No experience entries yet.</div>}
      {items.map((item, index) => (
        <div className="admin-repeatable-row" key={`experience-${index}`}>
          <div className="admin-form-grid three">
            <label className="admin-form-field">
              <span>Title</span>
              <input
                className="admin-input"
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
                placeholder="Role title"
              />
              {errorFor?.(`experience.${index}.title`) && (
                <span className="admin-field-error">{errorFor(`experience.${index}.title`)}</span>
              )}
            </label>
            <label className="admin-form-field">
              <span>Position</span>
              <input
                className="admin-input"
                value={item.position}
                onChange={(e) => updateItem(index, { position: e.target.value })}
                placeholder="Assignment"
              />
            </label>
            <label className="admin-form-field">
              <span>Start year</span>
              <input
                className="admin-input"
                type="number"
                value={item.start_year}
                onChange={(e) => updateItem(index, { start_year: e.target.value })}
                placeholder="YYYY"
              />
              {errorFor?.(`experience.${index}.start_year`) && (
                <span className="admin-field-error">
                  {errorFor(`experience.${index}.start_year`)}
                </span>
              )}
            </label>
            <label className="admin-form-field">
              <span>End year</span>
              <input
                className="admin-input"
                type="number"
                value={item.end_year}
                onChange={(e) => updateItem(index, { end_year: e.target.value })}
                placeholder="YYYY"
                disabled={item.is_current}
              />
            </label>
            <label className="admin-form-field inline">
              <span>Current role</span>
              <input
                className="admin-checkbox"
                type="checkbox"
                checked={item.is_current}
                onChange={(e) => updateItem(index, { is_current: e.target.checked })}
              />
            </label>
          </div>
          <button className="admin-btn ghost" type="button" onClick={() => removeRow(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="admin-btn secondary" type="button" onClick={addRow}>
        Add experience
      </button>
    </div>
  );
}
