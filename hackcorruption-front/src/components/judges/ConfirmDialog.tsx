type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div className="admin-modal-header">
          <h3 id="admin-modal-title">{title}</h3>
        </div>
        <p className="admin-modal-message">{message}</p>
        <div className="admin-modal-actions">
          <button className="admin-btn ghost" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`admin-btn ${tone}`} type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
