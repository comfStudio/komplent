import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId } = mongoose.Schema.Types

export const message_schema = new Schema({
    body: String,
    user: { 
        type: ObjectId, 
        ref: 'User'
    },
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const conversation_schema = new Schema({
    subject: String,
    type: {
        type: String,
        enum : ['private','staff'],
        default: 'private'
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
  }, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })