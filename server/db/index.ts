import mongoose from 'mongoose'
import getConfig from 'next/config'

import { User } from '@db/models'
import { IUser } from '@schema/user'
import { cookie_session } from '@server/middleware'
import jwt from 'jsonwebtoken'
import { JWT_KEY, JWT_EXPIRATION } from '@server/constants'


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

export const login_user = async ( user: IUser, req, res) => {
  if (user && req && res) {
    cookie_session(req, res)
    const token = jwt.sign({ username: user.username, user_id:user._id }, JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: JWT_EXPIRATION
    })
    return token
  }
}

export const logout_user = async (req, res) => {
  if (req && res) {
    cookie_session(req, res)
    req.session = null
  }
}