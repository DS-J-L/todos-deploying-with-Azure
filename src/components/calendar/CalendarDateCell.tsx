import type { OccurrenceItem } from "@/types/event";

type CalendarDateCellProps = {
  date: string;
  isToday: boolean;
  isSelected: boolean;
  items: OccurrenceItem[];
  onClick: () => void;
};

export function CalendarDateCell({ date, isToday, isSelected, items, onClick }: CalendarDateCellProps) {
  return (
    <button
      className={`min-h-32 rounded-2xl border p-3 text-left transition ${
        isSelected ? "border-slate-900 bg-slate-900 text-white" : "border-[var(--border)] bg-white/80"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{date.slice(-2)}</span>
        {isToday ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Today</span> : null}
      </div>

      <div className="mt-3 space-y-2">
        {items.slice(0, 3).map((item) => (
          <div
            className={`truncate rounded-full px-3 py-1 text-xs ${
              isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
            }`}
            key={`${item.eventId}-${item.occurrenceDate}`}
          >
            {item.title}
          </div>
        ))}

        {items.length > 3 ? <p className="text-xs opacity-80">+{items.length - 3} more</p> : null}
      </div>
    </button>
  );
}

