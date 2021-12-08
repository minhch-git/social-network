import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { postService, userService } from '../services'
import { tranSuccess } from '../../lang/en'

/**
 * Create a post
 * @POST posts/
 * @access private
 */
const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost({
    ...req.body,
    postedBy: req.user.id,
  })
  res.status(201).json({ post, message: tranSuccess.created_success('post') })
})

/**
 * Get all posts
 * @GET posts/
 * @access private
 */
const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postedBy'])
  let options = pick(req.query, ['sort', 'select', 'sortBy', 'limit', 'page'])
  options.populate = 'postedBy'
  const result = await postService.queryPosts(filter, options)
  res.send(result)
})

/**
 * Get a post by post id
 * @GET posts/:postId
 * @access public
 */
const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId)
  if (!post) {
    throw createError.NotFound()
  }
  res.status(200).json({ post })
})

/**
 * Update a post by postId
 * @PATCH posts/:postId
 * @access private
 */
const updatePost = catchAsync(async (req, res) => {
  if (req.body.pinned) {
    await postService.updatePosts({ postedBy: req.user.id }, { pinned: false })
  }

  const postUpdated = await postService.updatePostById(
    req.params.postId,
    req.body
  )
  res.status(200).json({ postUpdated, message: tranSuccess.updated_success })
})

/**
 * Delete post by postId
 * @DELETE posts/:postId
 * @access private
 */
const deletePost = catchAsync(async (req, res) => {
  let filter = {
    postedBy: req.user._id,
    postId: req.params.postId,
  }
  const post = await postService.findOneAndDeletePost(filter)
  res.status(200).json({ post, message: tranSuccess.deleted_success('post') })
})

/**
 * Like post
 * @PATCH posts/:postId/like
 * @access private
 */
const likePost = catchAsync(async (req, res) => {
  const { postId } = req.params
  const user = req.user
  const isLiked = user.likes && user.likes.includes(postId)
  const options = isLiked ? '$pull' : '$addToSet'
  await userService.updateUser(
    { _id: user.id },
    {
      [options]: { likes: postId },
    }
  )
  const postUpdated = await postService.updatePostById(postId, {
    [options]: { likes: user.id },
  })
  res.status(200).json({ post: postUpdated })
})

/**
 * Like post
 * @PATCH posts/:postId/like
 * @access private
 */
const retweetPost = catchAsync(async (req, res) => {})

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  retweetPost,
}
