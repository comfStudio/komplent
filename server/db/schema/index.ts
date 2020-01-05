import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'

import { STATES } from '@server/constants'
import { is_server } from '@utility/misc'
import CONFIG from '@server/config'

const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseVirtuals = require('mongoose-lean-virtuals')
const mongooseDefaults = require('mongoose-lean-defaults')
const mongooseGetters = require('mongoose-lean-getters')
const mongoosePaginate = require('mongoose-paginate')

if (is_server()) {
    mongoose.ObjectId.get(v => {
        if (v instanceof mongoose.Types.ObjectId) {
            v = v.toString()
        }
        return v
    })
}

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
        schema.plugin(mongoosastic, { hosts: EL_HOSTS, ...params })
    }
}

export const configure = (
    schema,
    {
        autopopulate = true,
        virtuals = true,
        defaults = true,
        getters = true,
        paginate = false,
    } = {}
) => {
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
        if (paginate) {
            schema.plugin(mongoosePaginate)
        }
    }
}

export const es_date_type = {
    es_type: 'date',
    es_format: "yyyy-MM-DD'T'HH:mm:ss.SSSZ"
}

export const optional_with_length = (minLength, maxLength) => {
    minLength = minLength || 0;
    maxLength = maxLength || Infinity;
    return {
      validator : function(value) {
        if (value === undefined) return true;
        return value.length >= minLength && value.length <= maxLength;
      },
      message : 'Optional field is shorter than the minimum allowed length (' + minLength + ') or larger than the maximum allowed length (' + maxLength + ')'
    }
  }