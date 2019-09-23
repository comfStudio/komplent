import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId, Mixed, Decimal128 } = mongoose.Schema.Types

export const commission_schema = new Schema({
    body: String,
    limit_date: Date,
    complete_date: Date,
    completed: { type: Boolean, default: false},
    accepted: { type: Boolean, default: false},
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
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

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
  }, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const comission_rate_schema = new Schema({
    title: String,
    description: String,
    negotiable: Boolean,
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
  }, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })