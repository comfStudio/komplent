import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId } = mongoose.Schema.Types

export const image_schema = new Schema({
    _id: ObjectId,
    created: {
        type: Date,
        default: Date.now,
    },
    name: String,
    paths: [{ 
        path: String,
        data: Buffer,
        size: {
            type: String,
            enum : ['thumb','big', 'original'],
            default: 'original'
          } 
    }],
})

export const attachment_schema = new Schema({
    _id: ObjectId,
    type:{
        type: String,
        enum : ['image','file'],
        default: 'file'
      },
    created: {
        type: Date,
        default: Date.now,
    },
    name: String,
    paths: [{ 
        path: String,
        data: Buffer,
        size: {
            type: String,
            enum : ['thumb','big', 'original'],
            default: 'original'
          } 
    }],
})

export const tag_schema = new Schema({
    _id: ObjectId,
    name: {type: String, required: true, unique:true},
})