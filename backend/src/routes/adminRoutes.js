import { Router } from 'express'
import { param } from 'express-validator'
import authMiddleware from '../middleware/authMiddleware.js'
import validateRequest from '../middleware/validateRequest.js'
import { getContactMessages, markContactAsRead } from '../controllers/contactController.js'

const router = Router()

router.use(authMiddleware)

router.get('/contacts', getContactMessages)

router.patch(
  '/contacts/:id/read',
  [param('id').isMongoId().withMessage('Invalid contact id')],
  validateRequest,
  markContactAsRead,
)

export default router
