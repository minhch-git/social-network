import { Router } from 'express'
import { requireLoggedIn, requireLoggedOut } from '../middlewares/auth'

const router = new Router()

export default router
