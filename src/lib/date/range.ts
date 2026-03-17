import { WEEK_STARTS_ON } from "@/features/calendar/constants";
import type { CalendarView, DateRange } from "@/types/event";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateKey(date = new Date()) {
  return formatLocalDateKey(date);
}

export function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);
  return nextDate;
}

export function addMonths(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + amount);
  return nextDate;
}

export function compareIsoDate(left: string, right: string) {
  return left.localeCompare(right);
}

export function startOfWeek(date: Date) {
  const normalizedDay = (date.getUTCDay() - WEEK_STARTS_ON + 7) % 7;
  return addDays(date, -normalizedDay);
}

export function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function endOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

export function getRangeForView(view: CalendarView, anchorDate: string): DateRange {
  const anchor = parseIsoDate(anchorDate);

  if (view === "day") {
    return { start: anchorDate, end: anchorDate };
  }

  if (view === "week") {
    const start = startOfWeek(anchor);
    const end = addDays(start, 6);
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }

  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);

  return { start: toIsoDate(start), end: toIsoDate(end) };
}

export function buildWeekDates(anchorDate: string) {
  const weekStart = startOfWeek(parseIsoDate(anchorDate));
  return Array.from({ length: 7 }, (_, index) => toIsoDate(addDays(weekStart, index)));
}

export function buildMonthMatrix(anchorDate: string) {
  const monthStart = startOfMonth(parseIsoDate(anchorDate));
  const gridStart = startOfWeek(monthStart);

  return Array.from({ length: 6 }, (_, rowIndex) =>
    Array.from({ length: 7 }, (_, columnIndex) =>
      toIsoDate(addDays(gridStart, rowIndex * 7 + columnIndex))
    )
  );
}

export function shiftAnchorDate(view: CalendarView, anchorDate: string, amount: number) {
  const anchor = parseIsoDate(anchorDate);

  if (view === "day") {
    return toIsoDate(addDays(anchor, amount));
  }

  if (view === "week") {
    return toIsoDate(addDays(anchor, amount * 7));
  }

  return toIsoDate(addMonths(anchor, amount));
}

export function getToolbarLabel(view: CalendarView, anchorDate: string) {
  const anchor = parseIsoDate(anchorDate);
  const year = anchor.getUTCFullYear();
  const month = anchor.getUTCMonth() + 1;
  const day = anchor.getUTCDate();

  if (view === "day") {
    return `${year}.${month}.${day}`;
  }

  if (view === "week") {
    const weekDates = buildWeekDates(anchorDate);
    return `${weekDates[0]} ~ ${weekDates[6]}`;
  }

  return `${year}년 ${month}월`;
}
