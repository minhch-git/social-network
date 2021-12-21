import { Router } from 'express'
import { chatController, messageController } from '../controllers'
import { requireLoggedIn } from '../middlewares/auth'
import validate from '../middlewares/validate'
import pick from '../utils/pick'
import { chatValidation, messageValidation } from '../validations'

const router = new Router()

router.get('/new', requireLoggedIn, messageController.getCreateNewChatPage)
router.get(
  '/content',
  requireLoggedIn,
  validate(messageValidation.getMessages),
  messageController.getMessage
)

router.get(
  '/:chatId',
  requireLoggedIn,
  validate(chatValidation.getChat),
  messageController.getChatPage
)

router.get('/', requireLoggedIn, messageController.getInboxPage)

router.post(
  '/',
  requireLoggedIn,
  validate(messageValidation.createMessage),
  messageController.createMessage
)

export default router
