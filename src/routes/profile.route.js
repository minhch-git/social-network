import { Router } from 'express'
import { requireLoggedIn } from '../middlewares/auth'
import { profileController } from '../controllers'
const router = new Router()

router.get(
  '/:username',
  requireLoggedIn,
  profileController.getProfileByUsername
)
router.get('/', requireLoggedIn, profileController.getProfile)

export default router
