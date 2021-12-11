import { Router } from 'express'
import { requireLoggedIn, requireLoggedOut } from '../middlewares/auth'
import { userService } from '../services'

const router = new Router()

router.get('/auth/login', requireLoggedOut, (req, res) => {
  res.render('auth/login', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/register', requireLoggedOut, (req, res) => {
  res.render('auth/register', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/forgot_password', requireLoggedOut, (req, res) => {
  res.render('auth/forgot_password', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/reset_password/:token', requireLoggedOut, (req, res) => {
  res.render('auth/reset_password', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/search', requireLoggedIn, (req, res) => {
  res.render('search', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Search',
    userLoggedIn: req.user,
    selectedPage: 'search',
  })
})

router.get('/message', requireLoggedIn, (req, res) => {
  res.render('message/message', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Message',
    userLoggedIn: req.user,
    selectedPage: 'message',
  })
})

// Profile page
const getProfilePayload = async (username, userLoggedIn) => {
  const user = await userService.getUserByUsername(username)
  if (user) {
    return {
      pageTitle: user.username,
      userLoggedIn,
      profileUser: user,
      userLoggedInJs: JSON.stringify({
        id: userLoggedIn.id,
        fullName: userLoggedIn.fullName,
      }),
    }
  }
  return {
    pageTitle: 'User not found',
    userLoggedIn,
    userLoggedInJs: JSON.stringify({
      id: userLoggedIn.id,
      fullName: userLoggedIn.fullName,
    }),
  }
}
router.get('/profile', requireLoggedIn, async (req, res) => {
  const payload = await getProfilePayload(req.params.username, req.user)
  res.render('profile', {
    selectedPage: 'profile',
    ...payload,
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/', requireLoggedIn, (req, res) => {
  res.render('home', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Home',
    selectedPage: 'home',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify({
      id: req.user.id,
      fullName: req.user.fullName,
    }),
  })
})

export default router
