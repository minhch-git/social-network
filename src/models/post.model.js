import mongoose, { Schema } from 'mongoose'
import toJSON from './plugins/toJson'
import paginate from './plugins/paginate'

const postSchema = new Schema(
  {
    content: { type: String, trim: true, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replyTo: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true }
)

// add plugin that converts mongoose to json
postSchema.plugin(toJSON)
postSchema.plugin(paginate)

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema)

export default Post
