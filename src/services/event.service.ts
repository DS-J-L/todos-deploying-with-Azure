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

export async function getOccurrencesForRange(view: CalendarView, anchorDate: string) {
  const range = getRangeForView(view, anchorDate);
  const events = await eventRepository.listEventsOverlappingRange(range.start, range.end);
  const completions = await occurrenceRepository.listCompletionStatesInRange(range.start, range.end);

  const occurrences = mergeCompletionState(
    events.flatMap((event) => expandOccurrencesWithinRange(event, range.start, range.end)),
    completions
  );

  return { view, range, occurrences };
}

export async function getEventDetail(id: string) {
  return eventRepository.getEventById(id);
}

export async function createEvent(payload: EventMutationInput) {
  // TODO: zod 검증/정규화가 추가되면 여기에서 recurrenceType별 정책을 한 번 더 보정한다.
  return eventRepository.createEvent(payload);
}

export async function updateEvent(id: string, payload: EventMutationInput) {
  return eventRepository.updateEvent(id, payload);
}

export async function deleteEvent(id: string) {
  return eventRepository.softDeleteEvent(id);
}

export async function completeOccurrence(event: EventRecord, occurrenceDate: string, isCompleted: boolean) {
  if (!expandOccurrencesWithinRange(event, occurrenceDate, occurrenceDate).length) {
    throw new Error("The requested occurrence does not belong to this event.");
  }

  return occurrenceRepository.upsertOccurrenceCompletion(event.id, occurrenceDate, isCompleted);
}

