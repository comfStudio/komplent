import mongoose from 'mongoose'
import getConfig from 'next/config'
import mongoosastic from 'mongoosastic'

import { STATES } from '@server/constants'
import { is_server } from '@utility/misc'
import CONFIG from '@server/config'

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

if (CONFIG.ELASTIC_URL) {
    EL_HOSTS.push(CONFIG.ELASTIC_URL)
    STATES.ES_SETUP = true
}

export const es_index = (schema, params) => {
    if (is_server() && EL_HOSTS.length) {
        schema.plugin(mongoosastic, {hosts: EL_HOSTS, ...params})
    }
}

export const configure = (schema, {autopopulate = true, virtuals = true, defaults = true, getters = true} = {}) => {
    if (is_server()) {
        if (autopopulate) {
            schema.plugin(mongooseAutopopulate)
        }
        if (virtuals) {
            schema.plugin(mongooseVirtuals)
        }
        if (defaults) {
            schema.plugin(mongooseDefaults)
        }
        if (getters) {
            schema.plugin(mongooseGetters)
        }
    }
}