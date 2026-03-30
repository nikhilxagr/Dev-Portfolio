import { Router } from 'express'
import { body } from 'express-validator'
import { createContactMessage } from '../controllers/contactController.js'
import validateRequest from '../middleware/validateRequest.js'

const router = Router()

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone')
      .optional({ values: 'falsy' })
      .trim()
      .matches(/^[0-9+\-\s]{8,18}$/)
      .withMessage('Phone must be 8-18 characters and use valid phone symbols'),
    body('service')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage('Service must be 2-120 characters'),
    body('message').trim().isLength({ min: 10, max: 1200 }).withMessage('Message must be 10-1200 characters'),
  ],
  validateRequest,
  createContactMessage,
)

export default router
