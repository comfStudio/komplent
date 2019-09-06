import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId } = mongoose.Schema.Types

export const message_schema = new Schema({
    _id: ObjectId,
    body: String,
    created: {
        type: Date,
        default: Date.now,
    },
    user: { 
        type: ObjectId, 
        ref: 'User'
    },
})

export const conversation_schema = new Schema({
    _id: ObjectId,
    subject: String,
    type: {
        type: String,
        enum : ['private','staff'],
        default: 'private'
      },
    created: {
        type: Date,
        default: Date.now,
      },
    users: [{ 
        type: ObjectId, 
        ref: 'User'
      }],
    messages: [{ 
        type: ObjectId, 
        ref: 'Message'
      }],
    attachments: [
        { 
            type: ObjectId, 
            ref: 'Attachment'
        }
    ]
  })