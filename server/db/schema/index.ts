import mongoose from 'mongoose'

const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseVirtuals = require('mongoose-lean-virtuals')
const mongooseDefaults = require('mongoose-lean-defaults')
const mongooseGetters = require('mongoose-lean-getters')

mongoose.plugin ? mongoose.plugin(mongooseAutopopulate) : null
mongoose.plugin ? mongoose.plugin(mongooseVirtuals) : null
mongoose.plugin ? mongoose.plugin(mongooseDefaults) : null
mongoose.plugin ? mongoose.plugin(mongooseGetters) : null