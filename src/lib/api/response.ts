import { NextResponse } from "next/server";

import type { ApiErrorBody, ApiResponse } from "@/types/api";

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, init);
}

export function jsonError(error: ApiErrorBody, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<never>>({ success: false, error }, init);
}

export function jsonNotImplemented(message: string) {
  return jsonError(
    {
      code: "NOT_IMPLEMENTED",
      message
    },
    { status: 501 }
  );
}

