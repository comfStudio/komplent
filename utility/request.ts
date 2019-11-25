import unfetch from 'isomorphic-unfetch'
import cookies from 'nookies'
import Router from 'next/router'

import { is_server } from '@utility/misc'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'

export const get_json = msg => {
    return JSON.parse(msg)
}

export const get_authorization_header = () => {
    let c = null
    if (!is_server()) {
        c = cookies.get({})
    } else {
        throw Error('Cannot retrieve cookies server-side')
    }

    return c[COOKIE_AUTH_TOKEN_KEY]
        ? {
              Authorization: `Bearer ${c[COOKIE_AUTH_TOKEN_KEY]}`,
          }
        : undefined
}

interface FetchInit extends Omit<RequestInit, 'body'> {
    body?: string | object
    json?: boolean
    auth?: boolean
}

export const fetch = (url, props: FetchInit = {}) => {
    let def_props: FetchInit = {
        credentials: 'include',
        method: 'get',
    }

    if (props.json || typeof props.body === 'object') {
        def_props.headers = Object.assign(
            def_props.headers || {},
            props.headers || {},
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        )

        if (typeof props.body !== 'string') {
            props.body = JSON.stringify(props.body)
        }
    }

    if (props.auth !== false) {
        let h = get_authorization_header()
        if (h && (!props.headers || !props.headers['Authorization'])) {
            def_props.headers = Object.assign(
                def_props.headers || {},
                props.headers || {},
                h
            )
        }
    }

    delete props.json
    delete props.auth

    let fetch_props: RequestInit = Object.assign(def_props, props)

    return unfetch(url, fetch_props)
}

export const get_user_room_id = ({ _id }) => {
    return `user::${_id}`
}

export const redirect_to = (
    destination,
    { res = undefined, status = undefined } = {}
) => {
    if (res) {
        res.writeHead(status || 302, { Location: destination })
        res.end()
    } else if (destination[0] === '/' && destination[1] !== '/') {
        Router.push(destination)
    } else {
        window.location = destination
    }
}
