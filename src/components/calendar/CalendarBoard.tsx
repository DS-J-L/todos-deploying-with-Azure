import { DayCalendarView } from "@/components/calendar/DayCalendarView";
import { MonthCalendarView } from "@/components/calendar/MonthCalendarView";
import { WeekCalendarView } from "@/components/calendar/WeekCalendarView";
import { buildWeekDates } from "@/lib/date/range";
import type { CalendarView, OccurrenceItem } from "@/types/event";

type CalendarBoardProps = {
  view: CalendarView;
  anchorDate: string;
  monthMatrix: string[][];
  events: Record<string, OccurrenceItem[]>;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEventClick: (event: OccurrenceItem) => void;
};

export function CalendarBoard({
  view,
  anchorDate,
  monthMatrix,
  events,
  selectedDate,
  onDateSelect,
  onEventClick
}: CalendarBoardProps) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      {view === "month" ? (
        <MonthCalendarView
          eventsByDate={events}
          monthMatrix={monthMatrix}
          onDateSelect={onDateSelect}
          selectedDate={selectedDate}
        />
      ) : null}

      {view === "week" ? (
        <WeekCalendarView
          eventsByDate={events}
          onDateSelect={onDateSelect}
          onEventClick={onEventClick}
          selectedDate={selectedDate}
          weekDates={buildWeekDates(anchorDate)}
        />
      ) : null}

      {view === "day" ? (
        <DayCalendarView date={selectedDate} items={events[selectedDate] ?? []} onEventClick={onEventClick} />
      ) : null}
    </section>
  );
}
