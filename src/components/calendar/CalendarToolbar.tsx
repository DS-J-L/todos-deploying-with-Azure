import { DateNavigator } from "@/components/calendar/DateNavigator";
import { ViewSwitcher } from "@/components/calendar/ViewSwitcher";
import type { CalendarView } from "@/types/event";

type CalendarToolbarProps = {
  currentView: CalendarView;
  anchorDate: string;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onCreate: () => void;
};

export function CalendarToolbar({
  currentView,
  anchorDate,
  label,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onCreate
}: CalendarToolbarProps) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)]">Calendar Toolbar</p>
          <p className="mt-2 text-sm text-[var(--muted)]">기준 날짜: {anchorDate}</p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <DateNavigator label={label} onNext={onNext} onPrev={onPrev} onToday={onToday} />

          <div className="flex flex-wrap items-center gap-3">
            <ViewSwitcher onChange={onViewChange} value={currentView} />
            <button
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
              onClick={onCreate}
              type="button"
            >
              일정 추가
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

