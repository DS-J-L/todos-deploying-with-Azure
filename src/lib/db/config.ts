const requiredDbEnvKeys = ["DB_SERVER", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;

export function hasDatabaseConfig() {
  return requiredDbEnvKeys.every((key) => {
    const value = process.env[key];
    return typeof value === "string" && value.length > 0;
  });
}

