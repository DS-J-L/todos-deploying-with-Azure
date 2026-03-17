import type { CalendarView, DateRange, EventRecord, OccurrenceItem } from "@/types/event";

export type ApiErrorBody = {
  code: string;
  message: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type RangeResponseData = {
  view: CalendarView;
  range: DateRange;
  occurrences: OccurrenceItem[];
};

export type EventDetailResponseData = EventRecord;
