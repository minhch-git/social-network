import { Router } from 'express'
const router = new Router()
import { auth, protect, requireLoggedIn } from '../middlewares/auth'
import { userController } from '../controllers'

router
  .route('/')
  .post(auth('admin'), userController.createUser)
  .get(userController.getUsers)

router.get('/me', protect, userController.getMe)
router.patch('/update-me', protect, userController.updateMe)

router
  .route('/:userId')
  .get(userController.getUser)
  .patch(auth('admin'), userController.updateUser)
  .delete(auth('admin'), userController.deleteUser)

router.get(
  '/:userId/followers',
  requireLoggedIn,
  userController.getUserFollowers
)

router.get(
  '/:userId/following',
  requireLoggedIn,
  userController.getUserFollowing
)
router.patch('/:userId/follow', requireLoggedIn, userController.follow)

export default router
