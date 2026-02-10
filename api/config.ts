export const config = {
  port: parseInt(process.env.PORT || "3000"),
  allowedOrigins: process.env.ALLOWED_ORIGINS || "*",
  jwtSecret: process.env.JWT_SECRET || "jwt-secret",
  isProd: process.env.NODE_ENV === "production" || false,
  logsServiceHost: process.env.LOGS_SERVICE_HOST || 'http://logs-service',
  logsServicePort: process.env.LOGS_SERVICE_PORT || 3000,
};
