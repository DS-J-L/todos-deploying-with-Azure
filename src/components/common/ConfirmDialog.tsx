type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Keep this as a lightweight placeholder until the project chooses a modal primitive.
export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>

      <div className="mt-5 flex gap-3">
        <button className="rounded-full border px-4 py-2 text-sm" onClick={onCancel} type="button">
          취소
        </button>
        <button
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white"
          onClick={onConfirm}
          type="button"
        >
          확인
        </button>
      </div>
    </div>
  );
}

