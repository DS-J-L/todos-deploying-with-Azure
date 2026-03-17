import { WeekDayColumn } from "@/components/calendar/WeekDayColumn";
import type { OccurrenceItem } from "@/types/event";

type WeekCalendarViewProps = {
  weekDates: string[];
  eventsByDate: Record<string, OccurrenceItem[]>;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEventClick: (event: OccurrenceItem) => void;
};

export function WeekCalendarView({
  weekDates,
  eventsByDate,
  selectedDate,
  onDateSelect,
  onEventClick
}: WeekCalendarViewProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {weekDates.map((date) => (
        <WeekDayColumn
          date={date}
          isSelected={date === selectedDate}
          items={eventsByDate[date] ?? []}
          key={date}
          onDateSelect={() => onDateSelect(date)}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}

