import { ZodError } from "zod";

import { jsonError } from "@/lib/api/response";

export class AppError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof AppError) {
    return jsonError(
      {
        code: error.code,
        message: error.message
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];

    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: firstIssue?.message ?? "잘못된 입력입니다."
      },
      { status: 400 }
    );
  }

  return jsonError(
    {
      code: "INTERNAL_ERROR",
      message: "요청을 처리하지 못했습니다."
    },
    { status: 500 }
  );
}

