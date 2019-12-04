import { es_index, configure, es_date_type } from '.'
import mongoose, { Document, Model } from 'mongoose'
import { tag_schema } from '@schema/general'
import { comission_rate_schema } from './commission'
import {
    nsfw_levels,
    NSFW_LEVEL,
    CommissionPhaseT,
    CommissionPhaseType,
    guideline_types,
} from '@server/constants'

const { Schema } = mongoose

const { ObjectId, Decimal128, Mixed } = mongoose.Schema.Types

export type CommissionProcessType = { type: CommissionPhaseType; done: boolean }

export const user_schema = new Schema(
    {
        name: { type: String, es_indexed: true },
        type: {
            type: String,
            enum: ['creator', 'consumer', 'staff'],
            default: 'consumer',
            es_indexed: true,
        },
        nsfw: {
            type: String,
            enum: nsfw_levels,
            default: NSFW_LEVEL.level_0,
            es_indexed: true,
        },
        email: { type: String, unique: true, trim: true },
        username: {
            type: String,
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 60,
            es_indexed: true,
        },
        password: { type: String, minLength: 8, select: false },
        avatar: {
            type: ObjectId,
            ref: 'Image',
        },
        country: { type: String, es_indexed: true },
        description: String,
        socials: [{ url: String, name: String }],
        notice_visible: {
            type: Boolean,
            default: false,
        },
        notice: { type: String, maxLength: 250 },
        profile_color: String,
        display_currency: String,
        profile_currency: String,
        ongoing_commissions_limit: { type: Number, default: 5, maxlength: 20 },
        ongoing_requests_limit: { type: Number, default: 10, maxlength: 50 },
        revisions_limit: { type: Number, default: 3 },
        commission_request_message: {
            type: ObjectId,
            ref: 'Text',
        },
        commission_accept_message: {
            type: ObjectId,
            ref: 'Text',
        },
        about: {
            type: ObjectId,
            ref: 'Text',
        },
        commission_process: {
            type: [Mixed],
            default: [
                { type: CommissionPhaseT.pending_approval, done: true },
                { type: CommissionPhaseT.pending_sketch, done: false },
                { type: CommissionPhaseT.revision, done: false, count: 3 },
                { type: CommissionPhaseT.pending_product, done: false },
                { type: CommissionPhaseT.revision, done: false, count: 3 },
                { type: CommissionPhaseT.pending_payment, done: false },
                { type: CommissionPhaseT.unlock, done: false },
                { type: CommissionPhaseT.complete, done: false },
            ],
        },
        commissions_open: {
            type: Boolean,
            default: false,
            es_indexed: true,
        },
        visibility: {
            type: String,
            enum: ['public', 'private', 'hidden'],
            default: 'private',
            es_indexed: true,
        },
        commission_guidelines: [
            {
                guideline_type: {
                    type: String,
                    enum: guideline_types,
                },
                value: {
                    type: String,
                    trim: true,
                },
            },
        ],
        profile_cover: {
            type: ObjectId,
            ref: 'Image',
        },
        profile_body: String,
        tags: [
            {
                type: ObjectId,
                ref: 'Tag',
                es_schema: tag_schema,
                es_indexed: true,
                es_select: 'name',
            },
        ],
        last_commissions_update: Date,
        commission_info: {
            type: ObjectId,
            ref: 'CommissionStats',
        },
        recommendations: [
            {
                type: ObjectId,
                ref: 'UserRecommendation',
            },
        ],
        commission_rates: [
            {
                type: ObjectId,
                ref: 'CommissionRate',
                es_schema: comission_rate_schema,
                es_indexed: true,
            },
        ],
        galleries: [
            {
                type: ObjectId,
                ref: 'Gallery',
            },
        ],
        created: {
            type: Date,
            es_indexed: true,
            default: Date.now,
            ...es_date_type
        },
        updated: {
            type: Date,
            es_indexed: true,
            default: Date.now,
            ...es_date_type
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(user_schema)

es_index(user_schema, {
    populate: [{ path: 'tags', select: 'name color' }],
})

// user_schema.method({
//   check_exists: async function(username: string = undefined, email: string = undefined) {
//     if (username) {
//       const r = await this.exists({username: username})
//       if (r)
//         return true
//     }
//     if (email) {
//       const r = await this.exists({email: email})
//       if (r)
//         return true
//     }
//     return false
//   }
// })

user_schema.virtual('followers', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'followee',
    justOne: false,
    options: { sort: { created: -1 } },
})

user_schema.virtual('followings', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'follower',
    justOne: false,
    options: { sort: { created: -1 } },
})

user_schema.virtual('rates', {
    ref: 'CommissionRate',
    localField: '_id',
    foreignField: 'user',
    justOne: false,
    options: { sort: { price: 1 } },
})

user_schema.statics.check_exists = async function({ username, email }) {
    if (username) {
        const r = await this.exists({ username: username })
        if (r) return true
    }
    if (email) {
        const r = await this.exists({ email: email })
        if (r) return true
    }
    return false
}

export interface IUser extends Document {
    username: string
    password: string
}

export interface IUserModel extends Model<IUser> {
    check_exists(param: object): boolean
}

export const gallery_schema = new Schema(
    {
        image: {
            type: ObjectId,
            ref: 'Image',
        },
        url: String,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(gallery_schema)

export const follow_schema = new Schema(
    {
        follower: {
            type: ObjectId,
            ref: 'User',
        },
        followee: {
            type: ObjectId,
            ref: 'User',
        },
        end: Date,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(follow_schema, {paginate: true})

export const commission_stats_schema = new Schema({
    approval_rate: Number,
    approval_time: Number,
    complete_time: Number,
    complete_rate: Number,
    average_price: Decimal128,
    rating: Number,
})

configure(commission_stats_schema)

export const user_recommendation_schema = new Schema(
    {
        description: String,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(user_recommendation_schema)

export const user_store_schema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        select: false,
        unique: true,
    },
    has_selected_usertype: Boolean,
})

configure(user_store_schema)

export default user_schema
