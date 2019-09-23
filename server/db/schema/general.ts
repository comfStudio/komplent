import mongoose from 'mongoose'

const { Schema } = mongoose

const { ObjectId } = mongoose.Schema.Types

export const image_schema = new Schema({
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
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const attachment_schema = new Schema({
    type:{
        type: String,
        enum : ['image','file'],
        default: 'file'
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
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

export const tag_schema = new Schema({
    name: {type: String, required: true, unique:true},
})