
const is_logged_in = req => {
}

export const with_user = (fn: Function, require = true) => (req, res) => {
    const user = is_logged_in(req)
    if (user) {
      req.user = user
    } else if (require) {
      res.status(403 ).json({ error: "invalid user" })
    }
    return fn(req, res)
  }