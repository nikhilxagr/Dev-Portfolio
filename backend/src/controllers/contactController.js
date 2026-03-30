import Contact from '../models/Contact.js'
import ApiError from '../utils/ApiError.js'
import { sendResponse } from '../utils/apiResponse.js'

export const createContactMessage = async (req, res, next) => {
  try {
    const message = await Contact.create(req.body)
    sendResponse(res, 201, 'Message submitted successfully', message)
  } catch (error) {
    next(error)
  }
}

export const getContactMessages = async (req, res, next) => {
  try {
    const { status = 'all', limit = '100' } = req.query
    const filters = {}

    if (status === 'new' || status === 'read') {
      filters.status = status
    }

    const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 300) : 100
    const messages = await Contact.find(filters).sort({ createdAt: -1 }).limit(parsedLimit)

    sendResponse(res, 200, 'Contact messages fetched successfully', messages)
  } catch (error) {
    next(error)
  }
}

export const markContactAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true, runValidators: true },
    )

    if (!message) {
      throw new ApiError(404, 'Contact message not found')
    }

    sendResponse(res, 200, 'Contact message marked as read', message)
  } catch (error) {
    next(error)
  }
}
