import unfetch from 'isomorphic-unfetch'
import cookies from 'nookies'

import { is_server } from '@utility/misc'
import { COOKIE_AUTH_TOKEN_KEY } from '@server/constants'

export const get_json = (msg) => {
    return JSON.parse(msg)
}

interface FetchInit extends Omit<RequestInit, 'body'> {
    body?: string | object
    json?: boolean
    auth?: boolean
}

export const fetch = (url, props: FetchInit = {}) => {
    let def_props: FetchInit = {
        credentials: "include",
        method: 'get',
    }

    if (props.json || typeof props.body === 'object') {
        def_props.headers = Object.assign(def_props.headers || {}, props.headers || {}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
        
        if (typeof props.body !== 'string') {
            props.body = JSON.stringify(props.body)
        }
    }

    if (props.auth !== false) {
        let c = null
        if (!is_server()) {
            c = cookies.get({})
        } else {
            throw Error("Cannot retrieve cookies server-side")
        }
        if (c[COOKIE_AUTH_TOKEN_KEY] && (!props.headers || !props.headers['Authorization'])) {
            def_props.headers = Object.assign(def_props.headers || {}, props.headers || {}, {
                'Authorization': `Bearer ${c[COOKIE_AUTH_TOKEN_KEY]}`,
                })
        }

    }

    
    delete props.json
    delete props.auth
    
    let fetch_props: RequestInit = Object.assign(def_props, props)

    return unfetch(url, fetch_props)
}

export const get_user_room_id = ({_id}) => {
    return `user::${_id}`
}