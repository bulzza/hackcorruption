import type { CaseTimelineEvent } from "../../data/cases";

export default function Timeline({ items }: { items: CaseTimelineEvent[] }) {
  return (
    <div className="timeline">
      {items.map((t, idx) => (
        <div className="timeline-item" key={`${t.date}-${idx}`}>
          <div className="timeline-marker">
            <div className={`timeline-dot ${t.active ? "active" : ""}`} />
            {idx !== items.length - 1 && <div className="timeline-line" />}
          </div>

          <div className="timeline-content">
            <div className="timeline-date">{t.date}</div>
            <div className="timeline-title">{t.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
