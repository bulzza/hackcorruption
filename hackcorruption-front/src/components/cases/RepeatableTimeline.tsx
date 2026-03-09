import type { CaseTimelineItemInput } from "../../services/casesService";

type RepeatableTimelineProps = {
  items: CaseTimelineItemInput[];
  onChange: (items: CaseTimelineItemInput[]) => void;
  errorFor?: (path: string) => string | undefined;
};

const emptyRow = (): CaseTimelineItemInput => ({
  event_name: "",
  event_date: "",
});

export default function RepeatableTimeline({
  items,
  onChange,
  errorFor,
}: RepeatableTimelineProps) {
  const updateItem = (index: number, updates: Partial<CaseTimelineItemInput>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

  const addRow = () => onChange([...items, emptyRow()]);
  const removeRow = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="admin-repeatable">
      {items.length === 0 && <div className="admin-empty-inline">No timeline events yet.</div>}
      {items.map((item, index) => (
        <div className="admin-repeatable-row" key={`timeline-${index}`}>
          <div className="admin-form-grid two">
            <label className="admin-form-field">
              <span>Event name</span>
              <input
                className="admin-input"
                value={item.event_name}
                onChange={(e) => updateItem(index, { event_name: e.target.value })}
                placeholder="Event name"
              />
              {errorFor?.(`case_timeline.${index}.event_name`) && (
                <span className="admin-field-error">
                  {errorFor(`case_timeline.${index}.event_name`)}
                </span>
              )}
            </label>
            <label className="admin-form-field">
              <span>Event date</span>
              <input
                className="admin-input"
                type="date"
                value={item.event_date}
                onChange={(e) => updateItem(index, { event_date: e.target.value })}
              />
              {errorFor?.(`case_timeline.${index}.event_date`) && (
                <span className="admin-field-error">
                  {errorFor(`case_timeline.${index}.event_date`)}
                </span>
              )}
            </label>
          </div>
          <button className="admin-btn ghost" type="button" onClick={() => removeRow(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="admin-btn secondary" type="button" onClick={addRow}>
        Add timeline event
      </button>
    </div>
  );
}
