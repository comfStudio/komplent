import { EL_HOSTS } from '.'
import mongoose, { Document, Model } from 'mongoose'
import mongoosastic from 'mongoosastic'

import { is_server } from '@utility/misc'
import { tag_schema } from '@schema/general'

const { Schema } = mongoose

const { ObjectId, Decimal128, Buffer } = mongoose.Schema.Types

export const user_schema = new Schema({
  name: { type: String, es_indexed:true },
  type: {
    type: String,
    enum : ['creator','consumer'],
    default: 'consumer',
    es_indexed:true
  },
  email: { type: String, unique: true, trim: true },
  username: { type: String, unique: true, trim: true, minLength: 3, maxLength: 60, es_indexed:true },
  password: { type: String, minLength: 8, select: false },
  avatar: { 
    type: ObjectId, 
    ref: 'Image'
  },
  origin: { type: String, es_indexed:true },
  notice: { type: String, maxLength: 250 },
  description: String,
  socials: [{ url: String, name: String }],
  tags: [{ 
    type: ObjectId, 
    ref: 'Tag',
    es_schema: tag_schema,
    es_indexed: true,
    es_select: "name"
  }],
  follows: [{ 
    type: ObjectId, 
    ref: 'User'
  }],
  last_commissions_update: Date,
  profile: { 
    type: ObjectId, 
    ref: 'Profile'
  },
  commission_info: { 
    type: ObjectId, 
    ref: 'CommissionStats'
  },
  recommendations: [{ 
    type: ObjectId, 
    ref: 'UserRecommendation'
  }],
  settings: { 
    type: ObjectId, 
    ref: 'UserSettings',
    autopopulate: true
  },
  commission_rates: [
    { 
      type: ObjectId, 
      ref: 'CommissionRate'
    }
  ],
  galleries: [
    { 
      type: ObjectId, 
      ref: 'Gallery'
    }
  ]
},{ timestamps: { createdAt: 'created', updatedAt: 'updated' } })

if (is_server()) {
  user_schema.plugin(mongoosastic, {
    hosts: EL_HOSTS,
    populate: [
      {path: 'tags', select: 'name color'}
    ]
  })
}



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

user_schema.virtual("followers", {
  ref: "Follow",
  localField: "_id",
  foreignField: "followee",
  justOne: false,
  options: { sort: { created: -1 } },
})

user_schema.virtual("followings", {
  ref: "Follow",
  localField: "_id",
  foreignField: "follower",
  justOne: false,
  options: { sort: { created: -1 } },
})

user_schema.virtual("rates", {
  ref: "CommissionRate",
  localField: "_id",
  foreignField: "user",
  justOne: false,
  options: { sort: { price: 1 } },
})

user_schema.statics.check_exists = async function({username, email}) {
      if (username) {
        const r = await this.exists({username: username})
        if (r)
          return true
      }
      if (email) {
        const r = await this.exists({email: email})
        if (r)
          return true
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

export const gallery_schema = new Schema({
  image: { 
    type: ObjectId, 
    ref: 'Image'
  },
  url: String
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const follow_schema = new Schema({
  follower: { 
    type: ObjectId, 
    ref: 'User',
  },
  followee: { 
    type: ObjectId, 
    ref: 'User',
  },
  end: Date
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const commission_stats_schema = new Schema({
  approval_rate: Number,
  approval_time: Number,
  complete_time: Number,
  complete_rate: Number,
  average_price: Decimal128,
  rating: Number,
})

export const profile_schema = new Schema({
  reviews: [],
  comments: [{ body: String, date: Date }],
  commission_guidelines: [
    {
      guideline_type: String,
      value: String
    }
  ],
  cover: { 
    type: ObjectId, 
    ref: 'Image'
  },
  body: String,
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const user_settings_schema = new Schema({
  notice_visible: {
    type: Boolean,
    default: false
  },
  color: String,
  display_currency: String,
  profile_currency: String,
  commissions_open: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum : ['public','private', 'hidden'],
    default: 'private'
  },
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const user_recommendation_schema = new Schema({
  description: String,
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const user_store_schema = new Schema({
  user: { 
    type: ObjectId, 
    ref: 'User',
    select: false,
    unique: true
  },
  has_selected_usertype: Boolean,
})


export default user_schema