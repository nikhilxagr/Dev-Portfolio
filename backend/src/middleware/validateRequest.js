import { validationResult } from 'express-validator'
import ApiError from '../utils/ApiError.js'

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]
    next(new ApiError(400, firstError.msg))
    return
  }

  next()
}

export default validateRequest
