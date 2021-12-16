import mongoose, { Schema } from 'mongoose'
import toJSON from './plugins/toJson'

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messageType: {
      type: String,
      enum: ['file', 'text', 'image'],
    },
    text: String,
    file: String,
  },
  { timestamps: true }
)

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON)

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema)

export default Message
