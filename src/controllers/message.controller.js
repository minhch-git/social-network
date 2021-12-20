import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import {
  chatService,
  postService,
  uploadService,
  userService,
} from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'
import messageService from '../services/message.service'

/**
 * Get a post by post id
 * @GET message/::username
 * @access public
 */
const getCreateNewChatPage = (req, res) => {
  res.render('message/new-message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'New Message',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
    selectedPage: 'messages',
  })
}

const getChatByUserId = (userLoggedInId, otherUserId) => {
  const filter = {
    isGroupChat: false,
    users: {
      $size: 2,
      $all: [
        { $elemMatch: { $eq: userLoggedInId } },
        { $elemMatch: { $eq: otherUserId } },
      ],
    },
  }
  const body = {
    $setOnInsert: {
      users: [userLoggedInId, otherUserId],
    },
  }
  const options = {
    new: true,
    upsert: true,
  }

  return chatService.updateChat(filter, body, options)
}

const getMessagePage = async (req, res) => {
  const userId = req.user._id
  const chatId = req.params.chatId
  let filter = pick(req.query, ['chatName'])
  filter = {
    ...filter,
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }

  let options = pick(req.query, ['sortBy', 'page', 'limit', 'select'])
  options.populate = 'users'
  const chat = await chatService.queryChats(filter, options)
  if (chat.chats.length === 0) {
    const user = await userService.getUserById(chatId)
    if (user) {
      const userChat = await getChatByUserId(req.user._id, user._id)
      chat.chats.push(userChat)
    }
  }

  if (chat.chats.length === 0) {
    req.flash(
      'errors',
      'Chat does not exits or you do not have permission to view it.'
    )
  }
  res.render('message/message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    sidebarChat: true,
    pageTitle: 'Message',
    userLoggedIn: req.user,
    selectedPage: 'messages',
    chat: chat.chats[0],
    userLoggedInJs: JSON.stringify(req.user),
  })
}

const getInboxPage = (req, res) => {
  res.render('message/inbox', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Inbox',
    userLoggedIn: req.user,
    selectedPage: 'messages',
    userLoggedInJs: JSON.stringify(req.user),
  })
}
export default {
  getCreateNewChatPage,
  getMessagePage,
  getInboxPage,
}
