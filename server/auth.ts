import { NextApiRequest } from 'next'

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