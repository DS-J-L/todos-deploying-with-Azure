import { getSqlPool } from "@/lib/db/sql";
import type { OccurrenceStatusRecord } from "@/types/event";

export async function listCompletionStatesInRange(
  _rangeStart: string,
  _rangeEnd: string
): Promise<OccurrenceStatusRecord[]> {
  // TODO: event_occurrences 범위 조회 쿼리를 구현한다.
  await getSqlPool();
  return [];
}

export async function upsertOccurrenceCompletion(
  _eventId: string,
  _occurrenceDate: string,
  _isCompleted: boolean
): Promise<OccurrenceStatusRecord> {
  // TODO: event_occurrences upsert 구문을 구현한다.
  await getSqlPool();
  throw new Error("upsertOccurrenceCompletion is not implemented yet.");
}

