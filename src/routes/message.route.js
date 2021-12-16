import { Router } from 'express'
import { messageController } from '../controllers'
import { requireLoggedIn } from '../middlewares/auth'

const router = new Router()
router.get(
  '/:username',
  requireLoggedIn,
  messageController.getMessagesInPersonal
)

router.get('/', requireLoggedIn, (req, res) => {
  res.render('message/message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Message',
    userLoggedIn: req.user,
    selectedPage: 'message',
    sidebarChat: true,
  })
})

export default router
