import mongoose from 'mongoose'

import '.'
import { events } from '@server/constants'

const { Schema } = mongoose

const { ObjectId, Buffer, Mixed } = mongoose.Schema.Types

export const image_schema = new Schema({
    name: String,
    paths: [{ 
        path: String,
        data: Buffer,
        size: {
            type: String,
            enum : ['thumb','big', 'original'],
            default: 'original'
          } 
    }],
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const attachment_schema = new Schema({
    type:{
        type: String,
        enum : ['image','file'],
        default: 'file'
      },
    name: String,
    paths: [{ 
        path: String,
        data: Buffer,
        size: {
            type: String,
            enum : ['thumb','big', 'original'],
            default: 'original'
          } 
    }],
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const tag_schema = new Schema({
    name: {type: String, required: true, unique:true},
    color: String,
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const event_schema = new Schema({
    type:{
        type: String,
        enum : events,
      },
    from_user: { 
        type: ObjectId, 
        ref: 'User',
    },
    data: Mixed,
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const notification = new Schema({
    type:{
        type: String,
        enum : events,
      },
    from_user: { 
        type: ObjectId, 
        ref: 'User',
    },
    to_user: { 
        type: ObjectId, 
        ref: 'User',
    },
    data: Mixed,
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })