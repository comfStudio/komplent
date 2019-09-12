import { NextApiRequest } from 'next'

import cookieSession from 'cookie-session'
import Keygrip from 'keygrip'
import jwt from 'jsonwebtoken'

import cookie from 'cookie'

import { get_json } from '@utility/request'
import { KEYS, JWT_KEY } from '@server/constants'
import { User } from '@db/models'

export interface ExApiRequest extends NextApiRequest {
  user?: any
  json?: any
}
export const get_jwt_data = (token) => {
  return jwt.verify(token, JWT_KEY)
}

export const get_jwt_user = async (jwt_data) => {
  if (jwt_data.user_id) {
    return await User.findById(jwt_data.user_id).lean()
  }
}

export const is_logged_in = async (req, res) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    let h = req.headers.authorization
    let token = h.substring(7, h.length)
    try {
      let auth_user = await get_jwt_user(get_jwt_data(token))
      if (auth_user) {
        return auth_user
      }
    } catch (err) {
    }

  } else {

  }
  return null
}

export const with_user = (fn: Function, require = true) => async (req, res) => {
    const user: any = await is_logged_in(req, res)
    if (user) {
      req.user = user
    } else if (require) {
      return res.status(403 ).json({ error: "invalid user" })
    } else {
      req.user = null
    }
    return await fn(req, res)
  }

export const with_json = (fn: Function, require = true) => async (req, res) => {
  req.json = null
  const type = req.headers['content-type'] || 'text/plain';
  const is_json = type.toLowerCase().includes("application/json")
  const length = req.headers['content-length'];
  if (req.body && is_json) {
    if (typeof req.body == 'string') {
      req.json = get_json(req.body)
    } else {
      req.json = req.body
    }
  }

  return await fn(req, res)
}

export const cookie_session = (opts => {
  const originalSession = cookieSession(opts)
  return (req, res) => originalSession(req, res, () => {})
})({
  name: '_session',
  keys: new Keygrip(KEYS, 'SHA384', 'base64'),
  maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
})

const set_cookie = (res, name, value, options = {}) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  if (!('path' in options)) {
    options.path = '/'
  }

  res.setHeader('Set-Cookie', cookie.serialize(name, String(stringValue), options))
}

export const with_cookie = handler => async (req, res) => {
  res.cookie = (name, value, options) => set_cookie(res, name, value, options)
  cookie_session(req, res)
  return await handler(req, res)
}

