import createError from 'http-errors'
import { Message, User } from '../models'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

/**
 * Create message
 * @param {Object} body
 * @returns {Promise<message>}
 */
const createMessage = async messageBody => {
  const newMessage = new Message(messageBody)
  await newMessage.save()
  await Message.populate(newMessage, ['sender', 'chat'])
  return newMessage
}

/**
 * Get messages by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<messages>}
 */
const queryMessages = async (filter, options) => {
  const customLabels = {
    docs: 'messages',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalMessages',
  }
  options = { ...options, customLabels }
  const messages = await Message.paginate(filter, options)
  return messages
}

/**
 * Find message by id
 * @param {Object} filter
 * @returns {Promise<messages>}
 */
const getMessages = async filter => {
  const messages = await Message.find(filter)
  return messages
}

/**
 * Find message by id
 * @param {Object} filter
 * @returns {Promise<message>}
 */
const getMessage = async filter => {
  return Message.findOne(filter)
}

/**
 * Find message by id
 * @param {ObjectId} messageId
 * @returns {Promise<message>}
 */
const getMessageById = async messageId => {
  const message = await Message.findById(messageId)
  return message
}

/**
 * Update message by id
 * @param {ObjectId} messageId
 * @param {Object} body
 * @returns {Promise<message>}
 */
const updateMessageById = async (messageId, messageBody) => {
  const messageUpdated = await Message.findByIdAndUpdate(
    messageId,
    messageBody,
    {
      new: true,
    }
  ).populate('messageedBy')
  if (!messageUpdated) {
    throw createError.NotFound()
  }
  return messageUpdated
}

/**
 * Update message by id
 * @param {Object} filter
 * @param {Object} messageBody
 * @returns {Promise<messages>}
 */
const updateMessages = async (filter, messageBody) => {
  const messages = await Message.updateMany(filter, messageBody, { new: true })
  return messages
}

/**
 * Delte message by id
 * @param {ObjectId} messageId
 * @returns {Promise<message>}
 */
const deleteMessageById = async messageId => {
  const message = await getMessageById(messageId)
  if (!message) {
    throw createError.NotFound()
  }
  const result = await message.remove()
  return result
}

/**
 * Delte message by id
 * @param {Object} filter
 * @returns {Promise<message>}
 */
const deleteMessage = async filter => {
  const message = await Message.findOneAndDelete(filter)
  return message
}

export default {
  createMessage,
  queryMessages,
  getMessages,
  getMessage,
  getMessageById,
  updateMessageById,
  updateMessages,
  deleteMessageById,
  deleteMessage,
}
