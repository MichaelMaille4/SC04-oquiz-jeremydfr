export const config = {
  port: parseInt(process.env.PORT || "3000"),
  allowedOrigins: process.env.ALLOWED_ORIGINS || "*",
  jwtSecret: process.env.JWT_SECRET || "jwt-secret",
  isProd: process.env.NODE_ENV === "production" || false,

  // AJOUT POUR MONGODB
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27018",
  mongoDbName: process.env.MONGO_DB_NAME || "logs_db",
};
