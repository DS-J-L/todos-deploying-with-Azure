import type { OccurrenceItem } from "@/types/event";

type DayCalendarViewProps = {
  date: string;
  items: OccurrenceItem[];
  onEventClick: (event: OccurrenceItem) => void;
};

export function DayCalendarView({ date, items, onEventClick }: DayCalendarViewProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white/80 p-5">
      <h2 className="text-lg font-semibold text-slate-900">{date}</h2>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <button
            className="block w-full rounded-2xl border border-[var(--border)] px-4 py-3 text-left"
            key={`${item.eventId}-${item.occurrenceDate}`}
            onClick={() => onEventClick(item)}
            type="button"
          >
            <strong className="block text-sm text-slate-900">{item.title}</strong>
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {item.isRecurring ? "반복 일정" : "단일 일정"}
            </span>
          </button>
        ))}

        {items.length === 0 ? <p className="text-sm text-[var(--muted)]">선택한 날짜에 일정이 없습니다.</p> : null}
      </div>
    </div>
  );
}

