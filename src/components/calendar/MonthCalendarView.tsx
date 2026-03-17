import { CalendarDateCell } from "@/components/calendar/CalendarDateCell";
import { getTodayDateKey } from "@/lib/date/range";
import type { OccurrenceItem } from "@/types/event";

type MonthCalendarViewProps = {
  monthMatrix: string[][];
  eventsByDate: Record<string, OccurrenceItem[]>;
  selectedDate: string;
  onDateSelect: (date: string) => void;
};

export function MonthCalendarView({
  monthMatrix,
  eventsByDate,
  selectedDate,
  onDateSelect
}: MonthCalendarViewProps) {
  const today = getTodayDateKey();

  return (
    <div className="grid gap-3 md:grid-cols-7">
      {monthMatrix.flat().map((date) => (
        <CalendarDateCell
          date={date}
          isSelected={date === selectedDate}
          isToday={date === today}
          items={eventsByDate[date] ?? []}
          key={date}
          onClick={() => onDateSelect(date)}
        />
      ))}
    </div>
  );
}

