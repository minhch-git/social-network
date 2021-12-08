import { Router } from 'express'
import { requireLoggedIn } from '../middlewares/auth'
import { postController } from '../controllers'
import validate from '../middlewares/validate'
import { postValidation } from '../validations'

const router = new Router()
router
  .route('/')
  .get(
    requireLoggedIn,
    validate(postValidation.getPosts),
    postController.getPosts
  )
  .post(
    requireLoggedIn,
    validate(postValidation.createPost),
    postController.createPost
  )

router.patch(
  '/:postId/like',
  requireLoggedIn,
  validate(postValidation.updatePost),
  postController.likePost
)

router
  .route('/:postId')
  .delete(
    requireLoggedIn,
    validate(postValidation.deletePost),
    postController.deletePost
  )
  .patch(
    requireLoggedIn,
    validate(postValidation.updatePost),
    postController.updatePost
  )

export default router
