import { Router } from 'express'
import upload from '../middlewares/upload'
import uploadStorage from '../middlewares/uploadStorage'
import protect from '../middlewares/auth'
import { uploadController } from '../controllers'

const router = new Router()

router.post(
  '/',
  protect,
  uploadStorage.single('avatar'),
  upload,
  uploadController.uploadAvatar
)

export default router
