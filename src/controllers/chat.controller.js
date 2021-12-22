import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { chatService, uploadService, userService } from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

/**
 * Create a chat
 * @POST chats/
 * @access private
 */
const createChat = catchAsync(async (req, res) => {
  req.body.users.push(req.user)
  let chatData = {
    users: req.body.users,
    isGroupChat: true,
  }
  const chat = await chatService.createChat(chatData)
  res.status(201).json({ chat, message: tranSuccess.created_success('chat') })
})

/**
 * Get all chats
 * @GET chats/
 * @access private
 */
const getChats = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['chatName'])
  let options = pick(req.query, ['sort', 'select', 'sortBy', 'limit', 'page'])
  filter = {
    ...filter,
    users: { $elemMatch: { $eq: req.user._id } },
  }
  options.populate = 'users,lastestMessage,lastestMessage.sender'
  const result = await chatService.queryChats(filter, options)
  res.send(result)
})

/**
 * Get a chat by chat id
 * @GET chats/:chatId
 * @access public
 */
const getChat = catchAsync(async (req, res) => {
  const chat = await chatService.getChat({
    _id: req.params.chatId,
    users: { $elemMatch: { $eq: req.user._id } },
  })
  if (!chat) {
    throw createError.NotFound()
  }
  res.status(200).json({ chat })
})

/**
 * Update a chat by chatId
 * @PATCH chats/:chatId
 * @access private
 */
const updateChat = catchAsync(async (req, res) => {
  const chatUpdated = await chatService.updateChatById(
    req.params.chatId,
    req.body
  )
  res.status(200).json({ chatUpdated, message: tranSuccess.updated_success })
})

/**
 * Delete chat by chatId
 * @DELETE chats/:chatId
 * @access private
 */
const deleteChat = catchAsync(async (req, res) => {
  const chat = await chatService.deleteChatById(req.params.chatId)
  if (!chat) throw createError.NotFound('Not found chat')
  return res
    .status(200)
    .json({ chat, message: tranSuccess.deleted_success('chat') })
})

export default {
  createChat,
  getChats,
  getChat,
  updateChat,
  deleteChat,
}
