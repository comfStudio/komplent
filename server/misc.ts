import jwt from 'jsonwebtoken'
import { URL } from 'url'

import { is_server } from '@utility/misc'
import { Text } from '@db/models'
import { fetch } from '@utility/request'
import { JWT_EXPIRATION, JWT_KEY } from './constants'

export const fetch_database_text = async (id: string) => {
    if (id) {
        const q = id
        if (is_server()) {
            return await Text.findById(q)
        } else {
            return await fetch('/api/fetch', {
                method: 'post',
                body: { model: 'Text', method: 'findById', query: q },
            }).then(async r => {
                if (r.ok) {
                    return (await r.json()).data
                }
                return null
            })
        }
    }
}

export const jwt_sign = (data, expiresIn = JWT_EXPIRATION) => {
    return jwt.sign(
        data,
        JWT_KEY,
        {
            algorithm: 'HS256',
            expiresIn: expiresIn,
        }
    )
}

export const jwt_verify = token => {
    return jwt.verify(token, JWT_KEY)
}

export const redis_url_parse = (url) => {
    const parsedURL = new URL(url)
    let d = {
        host: parsedURL.hostname || 'localhost',
        port: Number(parsedURL.port || 6379),
        database: (parsedURL.pathname || '/0').substr(1) || '0',
        password: parsedURL.password ? decodeURIComponent(parsedURL.password) : null
    }
    // if (d.host === 'localhost') {
    //     d.host = "127.0.0.1"
    // }
    return d
}