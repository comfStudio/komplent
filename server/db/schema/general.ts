import mongoose from 'mongoose'

import '.'
import { events } from '@server/constants'
import { configure } from '.'

const { Schema } = mongoose

const { ObjectId, Buffer, Mixed, Decimal128 } = mongoose.Schema.Types

export const image_schema = new Schema(
    {
        name: String,
        paths: [
            {
                key: String,
                url: String,
                size: {
                    type: String,
                    enum: ['thumb', 'small', 'medium', 'big', 'original'],
                    default: 'original',
                },
            },
        ],
        user: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(image_schema)

export const attachment_schema = new Schema(
    {
        name: String,
        key: String,
        url: String,
        user: {
            type: ObjectId,
            ref: 'User',
        },
        allowed_users: [{
            type: ObjectId,
            ref: 'User',
        }]
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(attachment_schema)

export const tag_schema = new Schema(
    {
        name: { type: String, required: true },
        identifier: { type: String, required: true, unique: true },
        special: { type: Boolean, default: false },
        categories: [
            {
                type: ObjectId,
                ref: 'Tag',
            }
        ],
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

notification_schema.index({created: 1},{expireAfterSeconds: 30 * 60 * 60 * 24}); // 30 days

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

export const license_schema = new Schema(
    {
        name: String,
        description: String,
        body: Mixed,
        user: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(license_schema)

export const gallery_schema = new Schema(
    {
        image: {
            type: ObjectId,
            ref: 'Image',
        },
        user: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(gallery_schema)