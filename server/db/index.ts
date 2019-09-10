import mongoose from 'mongoose'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: {},
  serverRuntimeConfig: {MONGODB_URL}
} = getConfig()

export function connect() {
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      auth:{authdb:"admin"}
    })
  }
}