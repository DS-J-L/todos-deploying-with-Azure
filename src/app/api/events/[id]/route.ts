import { jsonNotImplemented } from "@/lib/api/response";

// GET /api/events/:id
export async function GET() {
  return jsonNotImplemented("단일 일정 조회 API는 아직 구현되지 않았습니다.");
}

// PATCH /api/events/:id
export async function PATCH() {
  return jsonNotImplemented("일정 수정 API는 아직 구현되지 않았습니다.");
}

// DELETE /api/events/:id
export async function DELETE() {
  return jsonNotImplemented("일정 삭제 API는 아직 구현되지 않았습니다.");
}

