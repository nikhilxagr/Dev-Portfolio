import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'

let server

const canStartWithoutDatabase = () =>
  env.nodeEnv === 'development' || env.allowStartWithoutDb

const startServer = async () => {
  let dbConnected = false

  try {
    await connectDatabase()
    dbConnected = true
    console.log('Database connected')
  } catch (error) {
    if (!canStartWithoutDatabase()) {
      throw error
    }

    console.warn(
      'Database connection failed. Starting backend in limited mode because ALLOW_START_WITHOUT_DB is enabled.',
    )
    console.warn(`MongoDB error: ${error.message}`)
  }

  app.locals.dbConnected = dbConnected

  server = app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`)
  })
}

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`)

  if (server) {
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

startServer().catch((error) => {
  console.error('Failed to start backend:', error)

  if (error?.name === 'MongooseServerSelectionError') {
    console.error(
      'MongoDB Atlas connection failed. Verify Atlas Network Access (IP allowlist), cluster status (not paused), and MongoDB user credentials.',
    )
  }

  process.exit(1)
})
