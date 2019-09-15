import mongoose, { Document, Model } from 'mongoose'

const { Schema } = mongoose

const { ObjectId, Decimal128 } = mongoose.Schema.Types

export const user_schema = new Schema({
  name: String,
  type: {
    type: String,
    enum : ['creator','consumer'],
    default: 'consumer'
  },
  email: { type: String, unique: true, trim: true },
  username: { type: String, unique: true, trim: true, minLength: 3, maxLength: 60 },
  password: { type: String, minLength: 8, select: false },
  avatar: { 
    type: ObjectId, 
    ref: 'Image'
  },
  origin: String,
  description: String,
  socials: [{ url: String, name: String }],
  display_currency: String,
  profile_currency: String,
  average_price: Decimal128,
  private: Boolean,
  tags: [{ 
    type: ObjectId, 
    ref: 'Tag'
  }],
  rates: [{ 
    type: ObjectId, 
    ref: 'CommissionRate'
  }],
  rating: Number,
  followings: [{ 
    type: ObjectId, 
    ref: 'User'
  }],
  followers: [{ 
    type: ObjectId, 
    ref: 'User'
  }],
  commissions_open: Boolean,
  last_commissions_update: Date,
  last_update: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true
  },
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
  options: { 
    type: ObjectId, 
    ref: 'UserOptions'
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
})

export const comission_rate_schema = new Schema({
  price: Decimal128,
  image: { 
    type: ObjectId, 
    ref: 'Image'
  },
  description: String,
})

export const commission_stats_schema = new Schema({
  approval_rate: Number,
  approval_time: Number,
  complete_time: Number,
  complete_rate: Number,

})

export const profile_schema = new Schema({
  reviews: [],
  comments: [{ body: String, date: Date }],
  cover: { 
    type: ObjectId, 
    ref: 'Image'
  },
  body: String,
  options: { 
    type: ObjectId, 
    ref: 'ProfileOptions'
  },
})

export const profile_options_schema = new Schema({
  color: String,
})

export const user_options_schema = new Schema({
})

export const user_recommendation_schema = new Schema({
  description: String,
})

export const store_schema = new Schema({
  user: { 
    type: ObjectId, 
    ref: 'User',
    select: false
  },
  has_selected_usertype: Boolean,
})


export default user_schema