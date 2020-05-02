import { NextApiRequest, NextApiResponse } from 'next'

import cookieSession from 'cookie-session'
import Keygrip from 'keygrip'
import with_morgan from 'micro-morgan'
import redirect from 'micro-redirect'
import requestIp from 'request-ip'

import cookie from 'cookie'

import { get_json } from '@utility/request'
import { SESSION_KEYS, JWTData } from '@server/constants'
import { User } from '@db/models'
import { jwt_verify } from './misc'
import { psession_exists } from '@services/psession'

export interface ExApiRequest extends NextApiRequest {
    user?: any
    json?: any
    session?: any
    ip_address?: string
    cookie?(name: string, value: any, options: object)
}

export interface ExApiResponse extends NextApiResponse {
    redirect?(code: number, location: string)
}

export function get_jwt_data(token): JWTData {
    try {
        return jwt_verify(token)
    } catch (err) {}
    return {} as any
}

export const get_jwt_user = async jwt_data => {
    let user
    if (jwt_data.user_id) {
        user = await User.findById(jwt_data.user_id)
            .populate('settings')
            .populate('avatar')
            .lean()
        if (user.password_change_date.getTime() !== jwt_data.password_change_date) {
            user = null
        }
    }
    return user
}

export const is_logged_in = async (req, res) => {
    let token
    if ((
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer '))
    ) {
        let h = req.headers.authorization
        token = h.substring(7, h.length)
    }

    if (!token) {
        token = req?.session?.jwt_token
    }

    if (token) {
        const jwt_data = get_jwt_data(token)
        if (jwt_data.psession_token && await psession_exists(jwt_data.psession_token)) {
            try {
                let auth_user = await get_jwt_user(jwt_data)
                if (auth_user) {
                    if (!req.session) {
                        cookie_session(req, res)
                    }
                    if (!req?.session?.jwt_token) {
                        // eslint-disable-next-line
                        req.session.jwt_token = token
                    }
                    return auth_user
                }
            } catch (err) {}
        }
    }
    
    return null
}

export const with_user = (fn: Function, require = false) => async (
    req: ExApiRequest,
    res
) => {
    const user: any = await is_logged_in(req, res)
    if (user) {
        req.user = user
    } else if (require) {
        return res.status(403).json({ error: 'invalid user' })
    } else {
        req.user = null
    }
    return await fn(req, res)
}

export const with_require_user = (fn: Function) => async (req, res) => {
    return await with_user(fn, true)(req, res)
}

export const with_json = (fn: Function) => async (req, res) => {
    req.json = null
    const type =
        (req.headers ? req.headers['content-type'] : null) || 'text/plain'
    const is_json = type.toLowerCase().includes('application/json')
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
    keys: SESSION_KEYS && SESSION_KEYS.length ? new Keygrip(SESSION_KEYS, 'SHA384', 'base64') : ["1", "2", "3"],
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
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

    res.setHeader(
        'Set-Cookie',
        cookie.serialize(name, String(stringValue), options)
    )
}


export const with_ip_address = handler => async (req, res) => {
    req.ip_address = requestIp.getClientIp(req)
    return await handler(req, res)
}

export const with_redirect = handler => async (req, res) => {
    res.redirect = (...args) => redirect(res, ...args)
    return await handler(req, res)
}

export const with_cookie = handler => async (req, res) => {
    res.cookie = (name, value, options) => set_cookie(res, name, value, options)
    cookie_session(req, res)
    return await handler(req, res)
}

let first_request = false

export const with_first_request = handler => async (req, res) => {
    if (!first_request) {
        first_request = true
    }
    return await handler(req, res)
}

const middlewares = (auth = false) => [
    with_ip_address,
    with_first_request,
    with_json,
    with_cookie,
    with_redirect,
    auth ? with_require_user : with_user,
    with_morgan('tiny'),
]

const create_middleware = middlewares => {
    let rev_middlewares = middlewares.reverse()
    let middleware_func = handler => {
        let options = {}
        let is_func = true
        if (typeof handler == 'object') {
            options = handler
            is_func = false
        }
        const f = original_handler => async (req, res) => {
            req.method = req.method.toLowerCase()
            let h = original_handler
            rev_middlewares.forEach(v => {
                if (options[h]) {
                    h = v(h, ...options[h])
                } else {
                    h = v(h)
                }
            })
            return await h(req, res)
        }
        return is_func ? f(handler) : f
    }
    return middleware_func
}

export const with_middleware = create_middleware(middlewares())

export const with_auth_middleware = create_middleware(middlewares(true))
