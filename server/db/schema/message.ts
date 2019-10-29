import '.'
import mongoose from 'mongoose'
import { es_index } from '.'
import { commission_schema } from './commission'

const { Schema } = mongoose

const { ObjectId, Buffer } = mongoose.Schema.Types

export const conversation_schema = new Schema({
    subject: {
      type: String,
      es_indexed:true
    },
    type: {
        type: String,
        enum : ['private','staff', 'commission'],
        default: 'private',
        es_indexed:true
      },
    trashed: {
      type: Boolean,
      default: false,
      es_indexed:true
    },
    commission: { 
        type: ObjectId, 
        ref: 'Commission',
        es_schema: commission_schema,
        es_indexed: true,
      },
    last_message: {
      type: Date,
      es_indexed: true,
      default: Date.now
    },
    users: [{ 
        type: ObjectId,
        ref: 'User',
        es_indexed:true
      }],
    attachments: [
        { 
            type: ObjectId, 
            ref: 'Attachment'
        }
    ],
    created: {
      type: Date,
      es_indexed: true,
      default: Date.now
    },
    updated: {
      type: Date,
      es_indexed: true,
      default: Date.now
    },
  }, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

es_index(conversation_schema, {
  populate: [
    {path: 'commission', select: 'from_title to_title finished completed'},
  ]
})

conversation_schema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversation",
  justOne: false,
  options: { sort: { created: -1 } },
})

export const message_schema = new Schema({
  conversation: { 
    type: ObjectId, 
    ref: 'Conversation',
    es_indexed: true,
    required: true
  },
  body: {
    type: String,
    es_indexed: true
  },
  user: { 
      type: ObjectId, 
      ref: 'User',
      es_indexed: true,
      required: true
  },
  users_read: [{ 
    type: ObjectId, 
    ref: 'User'
  }],
  created: {
    type: Date,
    es_indexed: true,
    default: Date.now
  },
  updated: {
    type: Date,
    es_indexed: true,
    default: Date.now
  },
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

es_index(message_schema, {
})
