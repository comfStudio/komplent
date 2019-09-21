import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId, Mixed, Decimal128 } = mongoose.Schema.Types

export const commission_schema = new Schema({
    body: String,
    created: {
        type: Date,
        default: Date.now,
    },
    limit_date: Date,
    complete_date: Date,
    completed: { type: Boolean, default: false},
    accepted: { type: Boolean, default: false},
    last_updated: {
        type: Date,
        default: Date.now,
    },
    stage: {
        type: String,
        enum : ['pending','pending_first_payment', 'pending_product', 'pending_last_payment', 'complete'],
        default: 'pending'
      },
    requesting: { 
        type: ObjectId, 
        ref: 'User',
        required: true,
    },
    requester: { 
        type: ObjectId, 
        ref: 'User',
        required: true,
    },
    attachments: [
        { 
            type: ObjectId, 
            ref: 'Attachment'
        }
    ],
})

export const commission_extra_option_schema = new Schema({
    title: String,
    price: Decimal128,
    type: {
        type: String,
        enum: ['radio','input', 'checkbox'],
        default: "checkbox"
      },
    user: { 
        type: ObjectId, 
        ref: 'User',
        select: false,
      },
  })

export const comission_rate_schema = new Schema({
    title: String,
    description: String,
    price: Decimal128,
    image: { 
      type: ObjectId, 
      ref: 'Image'
    },
    extras: [{ 
        type: ObjectId, 
        ref: 'CommissionExtraOption',
    }],
    user: { 
        type: ObjectId, 
        ref: 'User',
        select: false,
      },
  })