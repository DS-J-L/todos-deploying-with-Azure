import { jsonNotImplemented } from "@/lib/api/response";

// PATCH /api/events/:id/occurrences/:date/complete
// TODO: 특정 발생일 유효성 검증 후 completion upsert를 수행한다.
export async function PATCH() {
  return jsonNotImplemented("발생일 완료 처리 API는 아직 구현되지 않았습니다.");
}

