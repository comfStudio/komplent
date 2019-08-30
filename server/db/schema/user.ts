import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId } = mongoose.Schema.Types

export const user_schema = new Schema({
  _id: ObjectId,
  name: String,
  username: String,
  password: String,
  picture: Buffer,
  origin: String,
  description: String,
  socials: [{ url: String, name: String }],
  private: Boolean,
  tags: [],
  rates: [],
  rating: Number,
  followings: [],
  followers: [],
  commissions_open: Boolean,
  last_commissions_update: Date,
  last_update: Date,
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
  picture: Buffer,
  url: String
})

export const comission_rate_schema = new Schema({
  _id: ObjectId,
  price: Number,
  picture: Buffer,
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
  cover: Buffer,
  body: String,
})

export const user_options_schema = new Schema({
  _id: ObjectId,
  color: String,

})

export default user_schema