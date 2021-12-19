import { Router } from 'express'
import { messageController } from '../controllers'
import { requireLoggedIn } from '../middlewares/auth'

const router = new Router()

router.get('/new', requireLoggedIn, (req, res) => {
  res.render('message/new-message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'New Message',
    userLoggedIn: req.user,
    selectedPage: 'messages',
  })
})

router.get('/', requireLoggedIn, (req, res) => {
  res.render('message/inbox', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Inbox',
    userLoggedIn: req.user,
    selectedPage: 'messages',
  })
})

export default router
