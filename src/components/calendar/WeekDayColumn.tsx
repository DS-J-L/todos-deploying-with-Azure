import type { OccurrenceItem } from "@/types/event";

type WeekDayColumnProps = {
  date: string;
  items: OccurrenceItem[];
  isSelected: boolean;
  onDateSelect: () => void;
  onEventClick: (event: OccurrenceItem) => void;
};

export function WeekDayColumn({
  date,
  items,
  isSelected,
  onDateSelect,
  onEventClick
}: WeekDayColumnProps) {
  return (
    <div className={`rounded-2xl border p-4 ${isSelected ? "border-slate-900 bg-slate-50" : "border-[var(--border)] bg-white/80"}`}>
      <button className="text-left text-sm font-semibold text-slate-900" onClick={onDateSelect} type="button">
        {date}
      </button>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <button
            className="block w-full rounded-2xl bg-slate-100 px-3 py-2 text-left text-sm text-slate-700"
            key={`${item.eventId}-${item.occurrenceDate}`}
            onClick={() => onEventClick(item)}
            type="button"
          >
            {item.title}
          </button>
        ))}

        {items.length === 0 ? <p className="text-xs text-[var(--muted)]">등록된 일정이 없습니다.</p> : null}
      </div>
    </div>
  );
}

