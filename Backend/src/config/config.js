import dotenv from "dotenv";
dotenv.config();

const requiredVars = ["MONGO_URI", "JWT_SECRET"];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

export const warnOptionalVars = (logger) => {
  if (config.NODE_ENV === "production") {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET)
      logger.warn("Google OAuth not configured");
    if (!config.EMAIL_USER || !config.REFRESH_TOKEN)
      logger.warn("Email service not configured");
    if (!config.IMAGE_KIT_PRIVATE_KEY)
      logger.warn("ImageKit not configured — image uploads will fail");
  }
};
