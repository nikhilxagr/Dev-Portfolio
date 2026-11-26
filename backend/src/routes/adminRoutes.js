import { Router } from 'express'
import { body, param } from 'express-validator'
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js'
import validateRequest from '../middleware/validateRequest.js'
import { adminApiLimiter } from '../middleware/rateLimiter.js'
import {
  getAdminOverview,
  getAdminPaymentsHistory,
  getAdminSystemStatus,
} from '../controllers/adminAnalyticsController.js'
import {
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
} from '../controllers/contactController.js'
import {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
} from '../controllers/adminUsersController.js'

const router = Router()

router.use(adminApiLimiter)
router.use(adminAuthMiddleware)

router.get('/overview', getAdminOverview)
router.get('/payments', getAdminPaymentsHistory)
router.get('/system-status', getAdminSystemStatus)

router.get('/contacts', getContactMessages)

router.patch(
  '/contacts/:id/read',
  [param('id').isMongoId().withMessage('Invalid contact id')],
  validateRequest,
  markContactAsRead,
)

router.delete(
  '/contacts/:id',
  [param('id').isMongoId().withMessage('Invalid contact id')],
  validateRequest,
  deleteContactMessage,
)

router.get('/users', getAdminUsers)

router.patch(
  '/users/:id',
  [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('name').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Name must be 1-120 chars'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('bio').optional().trim().isLength({ max: 250 }).withMessage('Bio max 250 chars'),
    body('phone').optional().trim().isLength({ max: 30 }).withMessage('Phone max 30 chars'),
    body('location').optional().trim().isLength({ max: 100 }).withMessage('Location max 100 chars'),
    body('website').optional().trim().isLength({ max: 200 }).withMessage('Website max 200 chars'),
    body('isEmailVerified').optional().isBoolean().withMessage('isEmailVerified must be boolean'),
  ],
  validateRequest,
  updateAdminUser,
)

router.delete(
  '/users/:id',
  [param('id').isMongoId().withMessage('Invalid user id')],
  validateRequest,
  deleteAdminUser,
)

export default router
