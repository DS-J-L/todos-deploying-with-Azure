import { jsonNotImplemented } from "@/lib/api/response";

// GET /api/events/range
// TODO: view, anchor 쿼리 검증 후 service에서 범위 계산과 recurrence expansion을 수행한다.
export async function GET() {
  return jsonNotImplemented("범위 조회 API는 아직 구현되지 않았습니다.");
}

