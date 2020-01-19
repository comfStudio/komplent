import qs from 'qs'
import CONFIG from '@server/config'

export const dashboard = '/dashboard'
export const home = '/'
export const inbox = '/inbox'
export const login = '/login'
export const join = '/join'
export const join_as_creator = '/join'
export const finish_join = '/finishjoin'
export const message = '/msg'
export const search = '/search'
export const commission = '/commission'
export const commission_requests = '/commissions/requests'
export const commission_settings = '/settings/commissions'
export const commissions = '/commissions'
export const profile_stats = '/api/profile/stats'
export const analytics = '/api/analytics'
export const aggregates = '/api/aggregates'
export const upload = '/api/upload'
export const asset_upload = '/api/asset_upload'
export const gallery_upload = '/api/gallery_upload'
export const gallery = '/api/gallery'
export const misc = '/api/misc'
export const cdn_upload = '/api/cdn_upload'
export const confirm = '/confirm'
export const recover = '/recover'
export const followers = '/followers'
export const followings = '/followings'

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
    conversation: { _id: string },
    query: object = undefined
) => {
    let url = inbox
    url += activeKey === 'inbox' ? '' : `/${activeKey}`
    url += '?' + qs.stringify({ ...query, convo_id: conversation._id.toString() })
    return url
}

export const make_commission_urlpath = (commission_object: { _id: string }) => {
    let url = commission
    url += '/' + commission_object._id
    return url
}

export const make_search_urlpath = (page, size, query) => {
    let url = search
    url += '?' + qs.stringify({...query, page, size})
    return url
}

export const make_follow_urlpath = (url, page, size, query) => {
    url += '?' + qs.stringify({...query, page, size})
    return url
}

export const make_login_next_urlpath = (next: string = undefined) => {
    next = next ?? location.pathname + location.search
    let url = login
    if (next) {
        url += '?' + qs.stringify({next})
    }
    return url
}

export const build_url = (urlpath, query = {}) => {
    let u = CONFIG.URL + urlpath
    let s = qs.stringify(query)
    if (s) {
        u += '?' + qs.stringify(query)
    }
    return u
}