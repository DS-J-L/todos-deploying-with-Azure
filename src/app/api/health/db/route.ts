import { NextResponse } from "next/server";

import { getDatabaseErrorPayload, getDatabaseHealth } from "@/lib/db/health";

export async function GET() {
  try {
    const health = await getDatabaseHealth();
    return NextResponse.json({
      success: true,
      data: health
    });
  } catch (error) {
    const payload = getDatabaseErrorPayload(error);

    return NextResponse.json(
      {
        success: false,
        error: payload
      },
      { status: payload.code === "DB_ERROR" ? 503 : 500 }
    );
  }
}

