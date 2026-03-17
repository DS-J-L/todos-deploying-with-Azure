export type CalendarView = "day" | "week" | "month";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export type DateRange = {
  start: string;
  end: string;
};

export type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  recurrenceType: RecurrenceType;
  recurrenceInterval: number;
  recurrenceDaysOfWeek: number[];
  recurrenceUntil: string | null;
  deletedAt?: string | null;
};

export type EventMutationInput = Omit<EventRecord, "deletedAt" | "id">;
export type EventFormValues = EventMutationInput;

export type OccurrenceItem = {
  eventId: string;
  title: string;
  description: string | null;
  occurrenceDate: string;
  isRecurring: boolean;
  isCompleted: boolean;
};

export type OccurrenceStatusRecord = {
  eventId: string;
  occurrenceDate: string;
  isCompleted: boolean;
};

