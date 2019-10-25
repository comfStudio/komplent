import mongoose from 'mongoose'
import getConfig from 'next/config'
import { STATES } from '@server/constants'

const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseVirtuals = require('mongoose-lean-virtuals')
const mongooseDefaults = require('mongoose-lean-defaults')
const mongooseGetters = require('mongoose-lean-getters')

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

mongoose.plugin ? mongoose.plugin(mongooseAutopopulate) : null
mongoose.plugin ? mongoose.plugin(mongooseVirtuals) : null
mongoose.plugin ? mongoose.plugin(mongooseDefaults) : null
mongoose.plugin ? mongoose.plugin(mongooseGetters) : null

export let EL_HOSTS = []

if (Object.entries(serverRuntimeConfig).length && serverRuntimeConfig.ELASTIC_URL) {
    EL_HOSTS.push(serverRuntimeConfig.ELASTIC_URL)
    STATES.ES_SETUP = true
}