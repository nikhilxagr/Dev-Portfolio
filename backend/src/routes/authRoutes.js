import { Router } from 'express'
import { body } from 'express-validator'
import { loginAdmin, verifyAdminSession } from '../controllers/authController.js'
import validateRequest from '../middleware/validateRequest.js'
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js'
import { adminAuthLimiter, adminApiLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post(
  '/login',
  adminAuthLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isString()
      .isLength({ min: 8, max: 120 })
      .withMessage('Password must be between 8 and 120 characters'),
  ],
  validateRequest,
  loginAdmin,
)

router.get('/verify', adminApiLimiter, adminAuthMiddleware, verifyAdminSession)

export default router
