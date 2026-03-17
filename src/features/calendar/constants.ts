import type { CalendarView } from "@/types/event";

// Week starts on Monday across docs, UI, and server date calculations unless the team decides otherwise.
export const WEEK_STARTS_ON = 1;
export const DEFAULT_CALENDAR_VIEW: CalendarView = "month";

