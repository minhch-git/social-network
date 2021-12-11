import { Router } from 'express'
import upload from '../middlewares/upload'
import uploadStorage from '../middlewares/uploadStorage'
import { requireLoggedIn } from '../middlewares/auth'
import { uploadController } from '../controllers'

const router = new Router()

router.post(
  '/coverPhoto',
  requireLoggedIn,
  uploadStorage.single('coppedCoverPhoto'),
  upload,
  uploadController.uploadCoverPhoto
)

router.post(
  '/',
  requireLoggedIn,
  uploadStorage.single('avatar'),
  upload,
  uploadController.uploadAvatar
)

export default router
