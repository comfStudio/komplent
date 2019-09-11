import { NextApiRequest } from 'next'

import { get_json } from '@utility/request'

export interface UserApiRequest extends NextApiRequest {
  user: any
}

export const is_logged_in = req => {
}

export const with_user = (fn: Function, require = true) => async (req, res) => {
    const user: any = is_logged_in(req)
    if (user) {
      req.user = user
    } else if (require) {
      return res.status(403 ).json({ error: "invalid user" })
    } else {
      req.user = null
    }
    return await fn(req, res)
  }

export interface JSONApiRequest extends NextApiRequest {
  json: any
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
