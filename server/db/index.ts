import mongoose from 'mongoose'
import getConfig from 'next/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

import { is_server } from '@utility/misc';

import mongooseAutopopulate from 'mongoose-autopopulate'
import mongooseVirtuals from 'mongoose-lean-virtuals'
import mongooseDefaults from 'mongoose-lean-defaults'
import mongooseGetters from 'mongoose-lean-getters'

if (is_server()) {
  mongoose.plugin(mongooseAutopopulate)
  mongoose.plugin(mongooseVirtuals)
  mongoose.plugin(mongooseDefaults)
  mongoose.plugin(mongooseGetters)
}


import { User } from '@db/models'
import { IUser } from '@schema/user'
import { cookie_session } from '@server/middleware'
import { JWT_KEY, JWT_EXPIRATION, CRYPTO_COST_FACTOR } from '@server/constants'

const { publicRuntimeConfig, serverRuntimeConfig }= getConfig()

export async function connect() {
  if (mongoose.connection.readyState == 0) {
    await mongoose.connect(serverRuntimeConfig.MONGODB_URL, {
      useNewUrlParser: true,
      auth: { authSource: "admin" }
    })
  }
}

export const create_user = async (props: IUser) => {
  let u = new User(props)
  if (u.password) {
    u.password = await bcrypt.hash(u.password, CRYPTO_COST_FACTOR)
  }

  return await u.save()
}

export const login_user = async ( user: IUser, password, req, res) => {
  if (user && req && res) {
    let r = await bcrypt.compare(password, user.password)
    if (r) {
      const token = jwt.sign({ username: user.username, user_id:user._id }, JWT_KEY, {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRATION
      })
      return token
    }
  }
  return null
}

export const logout_user = async (req, res) => {
  if (req && res) {
    cookie_session(req, res)
    req.session = null
  }
}