import qs from 'qs'

export const dashboard = '/dashboard'
export const home = '/'
export const inbox = '/inbox'
export const login = '/login'
export const commission = '/commission'
export const commission_requests = '/commissions/requests'
export const commissions = '/commissions'
export const analytics = '/api/analytics'
export const upload = '/api/upload'
export const cdn_upload = '/api/cdn_upload'

export const make_profile_id = user => {
    return `@${user.username}`
}

export const make_profile_urlpath = (user: { username: string }) => {
    return `/${make_profile_id(user || {})}`
}

export const get_profile_urlpart = (path: string) => {
    if (path.startsWith('/')) {
        path = path.slice(1)
        path = path.split('/')[0]
    }
    return path
}

export const parse_profile_id = (path: string) => {
    const match = /^@\S+$/u // @profile_id
    let p_id = ''
    path = get_profile_urlpart(path)
    if (match.test(path)) {
        p_id = path.slice(1)
    }
    return p_id
}

export const make_commission_rate_urlpath = (user, rate: { _id: string }) => {
    let url = make_profile_urlpath(user)
    url += '/commission'
    url += '?' + qs.stringify({ selected: rate._id })
    return url
}

export const make_conversation_urlpath = (
    activeKey: string,
    conversation: { _id: string }
) => {
    let url = inbox
    url += `/${activeKey}`
    url += '?' + qs.stringify({ convo_id: conversation._id })
    return url
}

export const make_commission_urlpath = (commission_object: { _id: string }) => {
    let url = commission
    url += '/' + commission_object._id
    return url
}
