import mongoose from 'mongoose'
import getConfig from 'next/config'

import { User } from '@db/models'
import { IUser } from '@schema/user'

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

export const create_user = async (props: IUser) => {
  let u = new User(props)
  return await u.save()
}