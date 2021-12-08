import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { userService } from '../services'
import { tranSuccess } from '../../lang/en'

/**
 * Create a user
 * @POST api/v1/users/
 * @access private
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body)
  res.status(201).json({ user, message: tranSuccess.created_success('user') })
})

/**
 * Get all users
 * @GET api/v1/users
 * @access public
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName', 'lastName', 'role', 'email'])
  let options = pick(req.query, ['sort', 'select', 'sortBy', 'limit', 'page'])
  const result = await userService.queryUsers(filter, options)
  res.send(result)
})

/**
 * Get a user by user id
 * @GET api/v1/users/:userId
 * @access public
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId)
  if (!user) {
    throw createError.NotFound()
  }
  res.status(200).json({ user })
})

/**
 * Update a user by userId
 * @PATCH api/v1/users/:userId
 * @access private
 */
const updateUser = catchAsync(async (req, res) => {
  const userUpdated = await userService.updateUserById(
    req.params.userId,
    req.body
  )
  res.status(200).json({ userUpdated, message: tranSuccess.updated_success })
})

/**
 * Delete user by userId
 * @DELETE api/v1/users/:userId
 * @access private
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId)
  res.status(200).json({ message: tranSuccess.deleted_success('user') })
})

/**
 * Get info user when logged in
 * @GET api/info
 * @access private
 */
const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id)

  res.json({ user })
})

/**
 * Update user when logged in
 * @PATCH api/user-update
 * @access private
 */
const updateMe = catchAsync(async (req, res, next) => {
  const userUpdated = await userService.updateUserById(req.user.id, req.body)
  res.status(200).json({ userUpdated })
})

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
}
