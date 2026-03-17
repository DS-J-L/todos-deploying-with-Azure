import type { OccurrenceItem } from "@/types/event";

type EventCardProps = {
  event: OccurrenceItem;
  occurrenceDate: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function EventCard({
  event,
  occurrenceDate,
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete
}: EventCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white/90 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{event.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{event.description ?? "설명 없음"}</p>
        </div>

        <button
          aria-label={`${event.title} 완료 상태 변경`}
          className={`h-5 w-5 rounded-full border ${
            isCompleted ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
          }`}
          onClick={onToggleComplete}
          type="button"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <span>{occurrenceDate}</span>
        <span>{event.isRecurring ? "반복 일정" : "단일 일정"}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="rounded-full border px-3 py-1.5 text-sm" onClick={onEdit} type="button">
          수정
        </button>
        <button className="rounded-full border px-3 py-1.5 text-sm text-rose-600" onClick={onDelete} type="button">
          삭제
        </button>
      </div>
    </article>
  );
}

