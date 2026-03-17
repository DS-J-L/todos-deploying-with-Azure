import { getSqlPool } from "@/lib/db/sql";
import type { EventMutationInput, EventRecord } from "@/types/event";

export async function listEventsOverlappingRange(_rangeStart: string, _rangeEnd: string): Promise<EventRecord[]> {
  // TODO: 조회 범위와 겹칠 가능성이 있는 시리즈만 SQL로 가져오도록 구현한다.
  await getSqlPool();
  return [];
}

export async function getEventById(_id: string): Promise<EventRecord | null> {
  // TODO: 수정 모달 진입용 단일 일정 조회 쿼리를 작성한다.
  await getSqlPool();
  return null;
}

export async function createEvent(_payload: EventMutationInput): Promise<{ id: string }> {
  // TODO: events 테이블 insert 후 생성된 id를 반환한다.
  await getSqlPool();
  throw new Error("createEvent is not implemented yet.");
}

export async function updateEvent(_id: string, _payload: EventMutationInput): Promise<{ updated: boolean }> {
  // TODO: 시리즈 단위 일정 수정만 허용한다.
  await getSqlPool();
  throw new Error("updateEvent is not implemented yet.");
}

export async function softDeleteEvent(_id: string): Promise<{ deleted: boolean }> {
  // TODO: soft delete 정책에 맞춰 deleted_at을 갱신한다.
  await getSqlPool();
  throw new Error("softDeleteEvent is not implemented yet.");
}

