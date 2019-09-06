import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId, Mixed } = mongoose.Schema.Types

export const commission_schema = new Schema({
    _id: ObjectId,
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
    options: { 
        type: ObjectId, 
        ref: 'CommissionOptions',
    },
})

export const commission_options_schema = new Schema({
    _id: ObjectId,
    type: {
        type: String,
        enum : ['radio','input', 'checkbox'],
      },
    data: Mixed,
  })