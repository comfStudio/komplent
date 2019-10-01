import '.'
import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId, Mixed, Decimal128 } = mongoose.Schema.Types

export const commission_schema = new Schema({
    from_title: String,
    to_title: String,
    body: String,
    expire_date: Date,
    end_date: Date,
    payment: { type: Boolean, default: false}, // there has been a transaction
    finished: { type: Boolean, default: false}, // commission has finished, could be cancelled or expired
    completed: { type: Boolean, default: false}, // commission was completed successfully
    accepted: { type: Boolean, default: false},
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
            ref: 'Attachment'
        }
    ],
    products: [
        { 
            type: ObjectId, 
            ref: 'Attachment'
        }
    ],
}, {
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    toJSON: { virtuals: true, getters: true, },
    toObject: { virtuals: true, getters: true },
 })

commission_schema.statics.find_related = async function(user, {populate = true, only_active = false, lean = true} = {}) {
    if (user) {
      const search = (q) => {
          let s = this.find(q)
          if (populate) {
              s = s.populate("from_user").populate("to_user")
          }
          if (only_active) {
              s = s.where("finished").equals(false)
          }
          if (lean) {
              s = s.lean()
          }
          return s
      }
      let r = await search({from_user: user})
      if (!r || !r.length) {
        r = await search({to_user: user})
      }
      if (r)
        return r
    }
    return null
}

commission_schema.virtual("stage", {
    ref: "CommissionPhase",
    localField: "_id",
    foreignField: "commission",
    justOne: true,
    options: { sort: { created: -1 } },
})

commission_schema.virtual("phases", {
    ref: "CommissionPhase",
    localField: "_id",
    foreignField: "commission",
    justOne: false,
    options: { sort: { created: 1 } },
})

commission_schema.virtual('phases').get(function (value) {
    return typeof value === 'object' ? [value] : value
})

commission_schema.virtual('stage').get(function (value) {
    return typeof value && Array.isArray(value) ? value[0] : value
})

export const commission_phase_schema = new Schema({
    type:{
        type: String,
        enum : ['pending_approval','pending_payment', 'pending_product', 'unlock', 'complete', 'cancel', 'reopen', 'refund'],
        required: true,
      },
    title: String,
    data: Object,
    done: {
        type: Boolean,
        default: false
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
      },
  }, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })