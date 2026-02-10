export const config = {
  databaseUrl: getEnv(() => process.env.DATABASE_URL, "DATABASE_URL"),
};

function getEnv(getter: () => string | undefined, variableName: string) {
  const value = getter();
  if (!value) throw new Error(`Missing env variable: ${variableName}`);
  return value;
}
