import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { postService, userService } from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

// Profile page
const getProfilePayload = async (username, userLoggedIn) => {
  const user =
    (await userService.getUserByUsername(username)) ||
    (await userService.getUserById(username))
  if (user) {
    return {
      pageTitle: user.username,
      profileUser: user,
      userLoggedIn,
      userLoggedInJs: JSON.stringify({
        id: userLoggedIn.id,
        fullName: userLoggedIn.fullName,
      }),
    }
  }
  return {
    selectedPage: 'profile',
    pageTitle: 'Profile',
    profileUser: userLoggedIn,
    userLoggedIn,
    userLoggedInJs: JSON.stringify({
      id: userLoggedIn.id,
      fullName: userLoggedIn.fullName,
    }),
  }
}

/**
 * Create a post
 * @POST profile/
 * @access private
 */
const getProfile = async (req, res) => {
  const payload = await getProfilePayload(req.params.username, req.user)
  res.render('profile', {
    ...payload,
    selectedPage: 'profile',
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
}
/**
 * Create a post
 * @POST profile/:username
 * @access private
 */
const getProfileByUsername = async (req, res) => {
  try {
    const payload = await getProfilePayload(req.params.username, req.user)
    res.render('profile', {
      ...payload,
      errors: req.flash('errors'),
      success: req.flash('success'),
    })
  } catch (error) {
    res.redirect('/not-found')
  }
}

export default {
  getProfile,
  getProfileByUsername,
}
