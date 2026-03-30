import dotenv from 'dotenv'

dotenv.config()

const requiredVariables = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH']

requiredVariables.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
})

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters')
}

const parseNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  adminEmail: process.env.ADMIN_EMAIL.toLowerCase(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  dbMaxPoolSize: parseNumber(process.env.DB_MAX_POOL_SIZE, 25),
  dbMinPoolSize: parseNumber(process.env.DB_MIN_POOL_SIZE, 5),
}
