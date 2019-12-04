import mongoose from 'mongoose'

import '.'
import { configure } from '.'
import { events, fee_types, FeeType } from '@server/constants'

const { Schema } = mongoose

const { ObjectId, Buffer, Mixed, Decimal128 } = mongoose.Schema.Types

export const payment_schema = new Schema(
    {
        method: String,
        transaction_id: String,
        price: { type: Decimal128, required: true },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunding', 'refunded'],
            default: 'pending',
        },
        fees: [{
            fee_type: {
                type: String,
                enum: fee_types,
                required: true
            },
            price: { type: Decimal128, required: true }
        }],
        from_user: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        to_user: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

configure(payment_schema)

export const payout_schema = new Schema(
    {
        method: String,
        from_date: { type: Date, required: true },
        to_date: { type: Date, required: true },
        fund: { type: Decimal128, required: true },
        fees: [{
            fee_type: {
                type: String,
                enum: fee_types,
                required: true
            },
            price: { type: Decimal128, required: true }
        }],
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        user: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

payout_schema.statics.latest_payout = async function(user, status=undefined){
    return await this.findOne({user, status}).sort({created: -1}).lean()
}


configure(payout_schema)