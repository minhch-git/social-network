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

router.patch(
  '/:postId/like',
  requireLoggedIn,
  validate(postValidation.updatePost),
  postController.likePost
)

router.post(
  '/:postId/retweet',
  requireLoggedIn,
  validate(postValidation.updatePost),
  postController.retweetPost
)

export default router
