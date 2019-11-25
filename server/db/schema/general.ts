import mongoose from 'mongoose'

import '.'
import { events } from '@server/constants'
import { configure } from '.'

const { Schema } = mongoose

const { ObjectId, Buffer, Mixed } = mongoose.Schema.Types

export const image_schema = new Schema(
    {
        name: String,
        paths: [
            {
                key: String,
                url: String,
                size: {
                    type: String,
                    enum: ['thumb', 'big', 'original'],
                    default: 'original',
                },
            },
        ],
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(image_schema)

export const attachment_schema = new Schema(
    {
        type: {
            type: String,
            enum: ['image', 'file'],
            default: 'file',
        },
        name: String,
        paths: [
            {
                key: String,
                url: String,
                size: {
                    type: String,
                    enum: ['thumb', 'big', 'original'],
                    default: 'original',
                },
            },
        ],
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(attachment_schema)

export const tag_schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        color: String,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(tag_schema)

export const event_schema = new Schema(
    {
        type: {
            type: String,
            enum: events,
        },
        from_user: {
            type: ObjectId,
            ref: 'User',
        },
        data: Mixed,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(event_schema)

export const notification_schema = new Schema(
    {
        type: {
            type: String,
            enum: events,
        },
        from_user: {
            type: ObjectId,
            ref: 'User',
        },
        to_user: {
            type: ObjectId,
            ref: 'User',
        },
        read: Date,
        data: Mixed,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(notification_schema)

export const text_schema = new Schema(
    {
        data: Mixed,
        user: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(text_schema)
