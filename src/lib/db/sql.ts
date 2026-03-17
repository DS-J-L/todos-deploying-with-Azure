import sql from "mssql";

// Centralize DB bootstrap so route handlers never reach for process.env directly.
const sqlConfig: sql.config = {
  server: process.env.DB_SERVER ?? "",
  port: Number(process.env.DB_PORT ?? "1433"),
  database: process.env.DB_NAME ?? "",
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  options: {
    encrypt: (process.env.DB_ENCRYPT ?? "true") === "true",
    trustServerCertificate: false
  }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getSqlPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConfig);
  }

  return poolPromise;
}
