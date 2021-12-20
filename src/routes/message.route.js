import { Router } from 'express'
import { chatController, messageController } from '../controllers'
import { requireLoggedIn } from '../middlewares/auth'
import validate from '../middlewares/validate'
import pick from '../utils/pick'
import { chatValidation } from '../validations'

const router = new Router()

router.get('/new', requireLoggedIn, messageController.getCreateNewChatPage)
router.get(
  '/:chatId',
  requireLoggedIn,
  validate(chatValidation.getChat),
  messageController.getMessagePage
)

router.get('/', requireLoggedIn, messageController.getInboxPage)

export default router
