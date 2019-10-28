import '.'
import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'
import { is_server } from '@utility/misc'
import { EL_HOSTS } from '.'
import { commission_schema } from './commission'

const { Schema } = mongoose

const { ObjectId, Buffer } = mongoose.Schema.Types

export const message_schema = new Schema({
    body: String,
    user: { 
        type: ObjectId, 
        ref: 'User'
    },
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

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
    active: {
        type: Boolean,
        default: true,
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
    last_message: Date,
    users: [{ 
        type: ObjectId,
        ref: 'User',
        es_indexed:true
      }],
    messages: [{ 
        type: ObjectId, 
        ref: 'Message',
        es_schema: message_schema,
        es_indexed: true,
        es_select: "body"
      }],
    attachments: [
        { 
            type: ObjectId, 
            ref: 'Attachment'
        }
    ]
  }, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

if (is_server() && EL_HOSTS.length) {
  conversation_schema.plugin(mongoosastic, {
    hosts: EL_HOSTS,
    populate: [
      {path: 'commission', select: 'from_title to_title finished completed'},
      {path: 'comments', select: 'body'},
    ]
  })
}

