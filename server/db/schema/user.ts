import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId, Decimal128 } = mongoose.Schema.Types

export const user_schema = new Schema({
  _id: ObjectId,
  name: String,
  type: {
    type: String,
    enum : ['creator','consumer'],
    default: 'consumer'
  },
  username: { type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 60 },
  password: { type: String, required: true, minLength: 8 },
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

export const gallery_schema = new Schema({
  _id: ObjectId,
  image: { 
    type: ObjectId, 
    ref: 'Image'
  },
  url: String
})

export const comission_rate_schema = new Schema({
  _id: ObjectId,
  price: Decimal128,
  image: { 
    type: ObjectId, 
    ref: 'Image'
  },
  description: String,
})

export const commission_stats_schema = new Schema({
  _id: ObjectId,
  approval_rate: Number,
  approval_time: Number,
  complete_time: Number,
  complete_rate: Number,

})

export const profile_schema = new Schema({
  _id: ObjectId,
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
  _id: ObjectId,
  color: String,
})

export const user_options_schema = new Schema({
  _id: ObjectId,
})

export const user_recommendation_schema = new Schema({
  _id: ObjectId,
  description: String,
})

export default user_schema