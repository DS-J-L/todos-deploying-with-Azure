import type { CalendarView } from "@/types/event";

type ViewSwitcherProps = {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
};

const viewOptions: CalendarView[] = ["day", "week", "month"];

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex rounded-full border border-[var(--border)] bg-white p-1">
      {viewOptions.map((option) => (
        <button
          className={`rounded-full px-4 py-2 text-sm ${
            option === value ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option === "day" ? "일" : option === "week" ? "주" : "월"}
        </button>
      ))}
    </div>
  );
}

