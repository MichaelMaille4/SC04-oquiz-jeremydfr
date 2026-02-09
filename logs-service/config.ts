export const config = {
    databaseUrl: getEnv(process.env.DATABASE_URL, "DATABASE_URL")
}

function getEnv(value: string | undefined, variableName: string) {
  if (!value) { throw new Error(`Missing env variable: ${variableName}`); }
  return value;
}