import dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};

export const warnOptionalVars = (logger) => {
  if (config.NODE_ENV === 'production') {
    if (!config.CLIENT_URL) {
      logger.warn(
        'Warning: CLIENT_URL is not set. Ensure that your frontend URL is configured correctly.'
      );
    }
  }
};
