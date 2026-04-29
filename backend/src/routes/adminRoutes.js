import { Router } from 'express'
import { param } from 'express-validator'
import authMiddleware from '../middleware/authMiddleware.js'
import validateRequest from '../middleware/validateRequest.js'
import {
  getAdminOverview,
  getAdminPaymentsHistory,
  getAdminSystemStatus,
} from '../controllers/adminAnalyticsController.js'
import { getContactMessages, markContactAsRead } from '../controllers/contactController.js'

const router = Router()

router.use(authMiddleware)

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

export default router
