import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { postService, uploadService, userService } from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'
import messageService from '../services/message.service'

/**
 * Get a post by post id
 * @GET message/::username
 * @access public
 */
const getMessagesInPersonal = catchAsync(async (req, res) => {
  let userChat = await userService.getUserByUsername(req.params.username)
  let message = await messageService.getMessagesInPersonal(
    userChat,
    req.user.id
  )
  res.render('message/message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Message',
    message,
    userChat,
    userLoggedIn: req.user,
    selectedPage: 'message',
    sidebarChat: true,
  })
})

export default {
  getMessagesInPersonal,
}
