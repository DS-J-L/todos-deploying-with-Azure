import { jsonNotImplemented } from "@/lib/api/response";

// POST /api/events
// TODO: zod 입력 검증 -> service 호출 -> 표준 응답 반환 순서로 구현한다.
export async function POST() {
  return jsonNotImplemented("이 엔드포인트는 일정 생성 구현 전까지 비활성화되어 있습니다.");
}

