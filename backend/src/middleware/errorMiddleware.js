import ApiError from '../utils/ApiError.js'

export const notFoundHandler = (_req, _res, next) => {
  next(new ApiError(404, 'Route not found'))
}

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(isProduction ? {} : { stack: error.stack }),
  })
}
