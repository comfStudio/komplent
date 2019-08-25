import getConfig from 'next/config'
import mongoose from 'mongoose'

const {
    publicRuntimeConfig: {},
    serverRuntimeConfig: {MONGODB_URL}
  } = getConfig()

mongoose.connect(MONGODB_URL, {useNewUrlParser: true});