import sql from "mssql";

import { hasDatabaseConfig } from "@/lib/db/config";
import { getSqlPool } from "@/lib/db/sql";

export type DatabaseHealth =
  | {
      mode: "local-file";
      status: "ok";
      message: string;
    }
  | {
      mode: "azure-sql";
      status: "ok";
      message: string;
      server: string;
      database: string;
    };

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  if (!hasDatabaseConfig()) {
    return {
      mode: "local-file",
      status: "ok",
      message: "DB 환경변수가 없어 로컬 파일 저장소를 사용 중입니다."
    };
  }

  const pool = await getSqlPool();
  await pool.request().query("SELECT 1 AS ok");

  return {
    mode: "azure-sql",
    status: "ok",
    message: "Azure SQL 연결이 정상입니다.",
    server: process.env.DB_SERVER ?? "",
    database: process.env.DB_NAME ?? ""
  };
}

export function getDatabaseErrorPayload(error: unknown) {
  if (error instanceof sql.ConnectionError || error instanceof sql.RequestError) {
    return {
      code: "DB_ERROR",
      message: "데이터베이스 연결 또는 쿼리 실행에 실패했습니다."
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "데이터베이스 상태를 확인하지 못했습니다."
  };
}

