import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

import { User } from '@db/models'
import { IUser } from '@schema/user'
import { cookie_session } from '@server/middleware'
import { JWT_KEY, JWT_EXPIRATION, CRYPTO_COST_FACTOR, STATES } from '@server/constants'

export const synchronize_indexes = async () => {
  if (STATES.ES_SETUP) {
    User.synchronize()
  }
}

export async function connect(MONGODB_URL) {
  console.log(MONGODB_URL)
  if (MONGODB_URL) {
    if (mongoose.connection.readyState == 0) {
      await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
      })
      STATES.MONGODB_CONNECTED = true
    } else {
      STATES.MONGODB_CONNECTED = true
    }
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