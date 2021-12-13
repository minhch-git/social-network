import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { postService, userService } from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

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
  let searchObj = req.query
  let filter = pick(searchObj, ['postedBy'])

  const searchContent = { $regex: new RegExp(searchObj.search, 'i') }
  if (searchObj.search) {
    filter = {
      ...filter,
      content: searchContent,
    }
  }

  let options = pick(req.query, ['sort', 'select', 'sortBy', 'limit', 'page'])
  options.populate = 'postedBy,retweetData,retweetData.postedBy'
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
    await postService.updatePosts(
      { postedBy: req.user._id, pinned: true },
      { pinned: false }
    )
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
    _id: req.params.postId,
  }
  const post = await postService.deletePost(filter)
  if (!post) throw createError.NotFound('Not found post')
  return res
    .status(200)
    .json({ post, message: tranSuccess.deleted_success('post') })
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
 * @PATCH posts/:postId/retweet
 * @access private
 */
const retweetPost = catchAsync(async (req, res) => {
  // Get content
  const { postId } = req.params
  const userId = req.user._id

  // Try and delete post
  const deletedPost = await postService.deletePost({
    postedBy: userId,
    retweetData: postId,
  })

  // Create options
  let option = deletedPost ? '$pull' : '$addToSet'
  let repost = deletedPost

  // If not found repost => create new post
  if (!repost) {
    const newItem = {
      postedBy: userId,
      retweetData: postId,
    }
    repost = await postService.createPost(newItem)
  }

  // Insert user retweet
  req.user = await userService.updateUser(
    { _id: userId },
    {
      [option]: { retweets: repost._id },
    }
  )

  // Insert post retweet
  let post = await postService.updatePostById(postId, {
    [option]: { retweetUsers: userId },
  })
  post = await User.populate(repost, [
    'postedBy',
    'retweetData',
    'retweetData.postedBy',
  ])

  // Success
  res.status(200).json({ message: 'Chia sẻ bài viết thành công.', post })
})

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  retweetPost,
}
