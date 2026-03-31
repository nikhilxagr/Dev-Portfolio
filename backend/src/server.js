import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'

let server

const startServer = async () => {
  let dbConnected = false

  try {
    await connectDatabase()
    dbConnected = true
    console.log('Database connected')
  } catch (error) {
    if (env.nodeEnv !== 'development') {
      throw error
    }

    console.warn('Database connection failed in development. Starting backend in limited mode.')
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
  process.exit(1)
})
