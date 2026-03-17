import { AppError } from "@/lib/api/errors";
import { expandOccurrencesWithinRange } from "@/lib/date/recurrence";
import { getRangeForView } from "@/lib/date/range";
import * as eventRepository from "@/repositories/event.repository";
import * as occurrenceRepository from "@/repositories/occurrence.repository";
import type {
  CalendarView,
  EventMutationInput,
  EventRecord,
  OccurrenceItem,
  OccurrenceStatusRecord
} from "@/types/event";

function mergeCompletionState(items: OccurrenceItem[], completions: OccurrenceStatusRecord[]) {
  const completionMap = new Map(completions.map((item) => [`${item.eventId}:${item.occurrenceDate}`, item.isCompleted]));

  return items.map((item) => ({
    ...item,
    isCompleted: completionMap.get(`${item.eventId}:${item.occurrenceDate}`) ?? false
  }));
}

function normalizeEventInput(payload: EventMutationInput): EventMutationInput {
  const recurrenceDaysOfWeek =
    payload.recurrenceType === "weekly"
      ? [...new Set(payload.recurrenceDaysOfWeek)].sort((left, right) => left - right)
      : [];

  const recurrenceInterval = payload.recurrenceType === "none" ? 1 : payload.recurrenceInterval;
  const recurrenceUntil = payload.recurrenceType === "none" ? null : payload.recurrenceUntil;

  return {
    ...payload,
    description: payload.description?.trim() ? payload.description.trim() : null,
    recurrenceInterval,
    recurrenceDaysOfWeek,
    recurrenceUntil
  };
}

export async function getOccurrencesForRange(view: CalendarView, anchorDate: string) {
  const range = getRangeForView(view, anchorDate);
  const events = await eventRepository.listEventsOverlappingRange(range.start, range.end);
  const completions = await occurrenceRepository.listCompletionStatesInRange(range.start, range.end);

  const occurrences = mergeCompletionState(
    events.flatMap((event) => expandOccurrencesWithinRange(event, range.start, range.end)),
    completions
  ).sort((left, right) => {
    if (left.occurrenceDate !== right.occurrenceDate) {
      return left.occurrenceDate.localeCompare(right.occurrenceDate);
    }

    return left.title.localeCompare(right.title, "ko");
  });

  return { view, range, occurrences };
}

export async function getEventDetail(id: string) {
  return eventRepository.getEventById(id);
}

export async function createEvent(payload: EventMutationInput) {
  return eventRepository.createEvent(normalizeEventInput(payload));
}

export async function updateEvent(id: string, payload: EventMutationInput) {
  const result = await eventRepository.updateEvent(id, normalizeEventInput(payload));

  if (!result.updated) {
    throw new AppError("NOT_FOUND", "수정할 일정을 찾을 수 없습니다.", 404);
  }

  return result;
}

export async function deleteEvent(id: string) {
  const result = await eventRepository.softDeleteEvent(id);

  if (!result.deleted) {
    throw new AppError("NOT_FOUND", "삭제할 일정을 찾을 수 없습니다.", 404);
  }

  return result;
}

export async function completeOccurrence(event: EventRecord, occurrenceDate: string, isCompleted: boolean) {
  if (!expandOccurrencesWithinRange(event, occurrenceDate, occurrenceDate).length) {
    throw new AppError("VALIDATION_ERROR", "해당 날짜에는 이 일정이 발생하지 않습니다.", 400);
  }

  return occurrenceRepository.upsertOccurrenceCompletion(event.id, occurrenceDate, isCompleted);
}
