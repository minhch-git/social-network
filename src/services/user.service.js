import createError from 'http-errors'
import { User } from '../models'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

/**
 * Create user
 * @param {Object} body
 * @returns {Promise<user>}
 */
const createUserLocal = async userBody => {
  const { firstName, lastName, email, password } = userBody
  const user = await getUserByEmail(email)
  if (user) {
    throw createError.BadRequest('Email already exists')
  }
  let item = {
    firstName,
    lastName,
    local: {
      verifyToken: uuidv4(),
      email,
      password,
    },
  }
  const newUser = new User(item)
  newUser.save()
  return newUser
}
/**
 * Create user
 * @param {Object} body
 * @returns {Promise<user>}
 */
const createUser = async userBody => {
  const newUser = new User(userBody)
  await newUser.save()
  return newUser
}

/**
 * Get users by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<users>}
 */
const queryUsers = async (filter, options) => {
  const customLabels = {
    docs: 'users',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalUsers',
  }
  options = { ...options, customLabels }
  const users = await User.paginate(filter, options)
  return users
}

/**
 * Find user by id
 * @param {ObjectId} userId
 * @returns {Promise<user>}
 */
const getUserById = async userId => {
  const user = await User.findById(userId)
  return user
}

/**
 * Find user by username
 * @param {String} username
 * @returns {Promise<user>}
 */
const getUserByUsername = async username => {
  const user = await User.findOne(username)
  return user
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<user>}
 */
const getUserByEmail = async email => {
  const user = await User.findOne({ 'local.email': email })
  return user
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<user>}
 */
const getUserByGoogleUid = async id => {
  const user = await User.findOne({ 'google.uid': id })
  return user
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<user>}
 */
const getUserByFacebookUid = async id => {
  const user = await User.findOne({ 'facebook.uid': id })
  return user
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserById = async (userId, body) => {
  const user = await getUserById(userId)

  if (!user) {
    throw createError.NotFound()
  }

  if (body.email && (await getUserByEmail(body.email))) {
    throw createError.BadRequest('Email already exists')
  }

  Object.assign(user, body)
  await user.save()
  return user
}

const updateUser = async (filter, userBody) => {
  const userUpdated = await User.findOneAndUpdate(filter, userBody)
  if (!userUpdated) throw createError.NotFound()
  return userUpdated
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserPasswordById = async (userId, password) => {
  const passwordHash = await bcrypt.hash(password, 8)
  const userUpdated = await User.findByIdAndUpdate(userId, {
    'local.password': passwordHash,
  })
  if (!userUpdated) throw createError.NotFound()

  return userUpdated
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const verifyUser = async token => {
  const user = await User.findOneAndUpdate(
    {
      'local.verifyToken': token,
    },
    {
      'local.verifyToken': null,
      'local.isActive': true,
    }
  )

  return user
}

/**
 * Delte user by id
 * @param {ObjectId} userId
 * @returns {Promise<user>}
 */
const deleteUserById = async userId => {
  const user = await getUserById(userId)
  if (!user) {
    throw createError.NotFound()
  }
  const result = await user.remove()
  return result
}

export default {
  createUserLocal,
  createUser,
  queryUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  updateUser,
  deleteUserById,
  updateUserPasswordById,
  verifyUser,
  getUserByGoogleUid,
  getUserByFacebookUid,
}
