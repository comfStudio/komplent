import '.'
import mongoose from 'mongoose'
import { commission_phases } from '@server/constants'
import { configure } from '.'

const { Schema } = mongoose

const { ObjectId, Mixed, Decimal128, Buffer } = mongoose.Schema.Types

export const commission_schema = new Schema(
    {
        from_title: String,
        to_title: String,
        body: Mixed,
        expire_date: Date,
        accept_date: Date,
        end_date: Date,
        refunded: { type: Boolean, default: false }, // payment has been refunded
        refunding: { type: Boolean, default: false }, // payment is being refunded
        finished: { type: Boolean, default: false }, // commission has finished, could be cancelled or expired
        completed: { type: Boolean, default: false }, // commission was completed successfully
        accepted: { type: Boolean, default: false },
        commission_process: [Mixed],
        commission_deadline: Number,
        revisions_limit: Number,
        queue_index: {type: Number, default: 0},
        rate: {
            type: Mixed,
            required: true,
        },
        payments: [{
            type: ObjectId,
            ref: 'Payment',
        }],
        extras: [Mixed],
        payment_count: {
            // how many times customer should pay
            type: Number,
            default: 1,
        },
        from_user: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        to_user: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        attachments: [
            {
                type: ObjectId,
                ref: 'Attachment',
            },
        ],
        products: [
            {
                type: ObjectId,
                ref: 'Attachment',
            },
        ],
    },
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' },
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true },
    }
)

configure(commission_schema, {paginate: true})

commission_schema.statics.find_related = async function(
    user,
    {
        populate = true,
        only_active = false,
        lean = true,
        accepted = undefined,
    } = {}
) {
    if (user) {
        const search = q => {
            let s = this.find(q)
            if (only_active) {
                s = s.where('finished').equals(false)
            }
            if (typeof accepted === 'boolean') {
                s = s.where('accepted').equals(accepted)
            }

            if (populate) {
                s = s.populate('from_user').populate('to_user')
            }

            s = s.sort({created: -1, accepted: -1})

            if (lean) {
                s = s.lean()
            }

            return s
        }
        let r = await search({ from_user: user })
        if (!r || !r.length) {
            r = await search({ to_user: user })
        }
        if (r) return r
    }
    return null
}

commission_schema.virtual('stage', {
    ref: 'CommissionPhase',
    localField: '_id',
    foreignField: 'commission',
    justOne: true,
    options: { sort: { created: -1 } },
})

commission_schema.virtual('phases', {
    ref: 'CommissionPhase',
    localField: '_id',
    foreignField: 'commission',
    justOne: false,
    options: { sort: { created: 1 } },
})

commission_schema.virtual('phases').get(function(value) {
    return typeof value === 'object' ? [value] : value
})

commission_schema.virtual('stage').get(function(value) {
    return typeof value && Array.isArray(value) ? value[0] : value
})

export const commission_phase_schema = new Schema(
    {
        type: {
            type: String,
            enum: commission_phases,
            required: true,
        },
        title: String,
        data: Mixed,
        done: {
            type: Boolean,
            default: false,
        },
        commission: {
            type: ObjectId,
            ref: 'Commission',
        },
        user: {
            type: ObjectId,
            ref: 'User',
        },
        done_date: Date,
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(commission_phase_schema)

export const commission_extra_option_schema = new Schema(
    {
        title: String,
        price: Decimal128,
        type: {
            type: String,
            enum: ['radio', 'input', 'checkbox'],
            default: 'checkbox',
        },
        user: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(commission_extra_option_schema)

export const comission_rate_schema = new Schema(
    {
        title: String,
        description: String,
        commission_deadline: {
            // in days
            type: Number,
            default: 14,
            es_indexed: true,
        },
        price: Decimal128,
        image: {
            type: ObjectId,
            ref: 'Image',
            set: function(img) {
                this._previous_image = this.image
                return img
            },
        },
        extras: [
            {
                type: ObjectId,
                ref: 'CommissionExtraOption',
            },
        ],
        user: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(comission_rate_schema)
