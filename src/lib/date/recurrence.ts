import { addDays, compareIsoDate, parseIsoDate, toIsoDate } from "@/lib/date/range";
import type { EventRecord, OccurrenceItem } from "@/types/event";

function shouldSkipDateByRange(date: string, start: string, end: string) {
  return compareIsoDate(date, start) < 0 || compareIsoDate(date, end) > 0;
}

function matchesWeeklyRule(event: EventRecord, occurrenceDate: string) {
  const targetDate = parseIsoDate(occurrenceDate);
  const startDate = parseIsoDate(event.startDate);
  const differenceInDays = Math.floor((targetDate.getTime() - startDate.getTime()) / 86400000);
  const differenceInWeeks = Math.floor(differenceInDays / 7);
  const weekday = targetDate.getUTCDay();

  return (
    differenceInDays >= 0 &&
    differenceInWeeks % event.recurrenceInterval === 0 &&
    event.recurrenceDaysOfWeek.includes(weekday)
  );
}

function matchesMonthlyRule(event: EventRecord, occurrenceDate: string) {
  const targetDate = parseIsoDate(occurrenceDate);
  const startDate = parseIsoDate(event.startDate);
  const monthDifference =
    (targetDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (targetDate.getUTCMonth() - startDate.getUTCMonth());

  return (
    monthDifference >= 0 &&
    monthDifference % event.recurrenceInterval === 0 &&
    targetDate.getUTCDate() === startDate.getUTCDate()
  );
}

export function occursOnDate(event: EventRecord, occurrenceDate: string) {
  if (compareIsoDate(occurrenceDate, event.startDate) < 0) {
    return false;
  }

  if (event.recurrenceUntil && compareIsoDate(occurrenceDate, event.recurrenceUntil) > 0) {
    return false;
  }

  if (event.recurrenceType === "none") {
    return occurrenceDate === event.startDate;
  }

  if (event.recurrenceType === "daily") {
    const targetDate = parseIsoDate(occurrenceDate);
    const startDate = parseIsoDate(event.startDate);
    const differenceInDays = Math.floor((targetDate.getTime() - startDate.getTime()) / 86400000);
    return differenceInDays >= 0 && differenceInDays % event.recurrenceInterval === 0;
  }

  if (event.recurrenceType === "weekly") {
    return matchesWeeklyRule(event, occurrenceDate);
  }

  return matchesMonthlyRule(event, occurrenceDate);
}

export function expandOccurrencesWithinRange(event: EventRecord, rangeStart: string, rangeEnd: string): OccurrenceItem[] {
  const items: OccurrenceItem[] = [];
  const hardEnd = event.recurrenceUntil && compareIsoDate(event.recurrenceUntil, rangeEnd) < 0 ? event.recurrenceUntil : rangeEnd;

  for (
    let cursor = parseIsoDate(rangeStart);
    compareIsoDate(toIsoDate(cursor), hardEnd) <= 0;
    cursor = addDays(cursor, 1)
  ) {
    const currentDate = toIsoDate(cursor);

    if (shouldSkipDateByRange(currentDate, rangeStart, hardEnd)) {
      continue;
    }

    if (!occursOnDate(event, currentDate)) {
      continue;
    }

    items.push({
      eventId: event.id,
      title: event.title,
      description: event.description,
      occurrenceDate: currentDate,
      isRecurring: event.recurrenceType !== "none",
      isCompleted: false
    });
  }

  return items;
}

