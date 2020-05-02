import RedisSessions from 'redis-sessions'
import { redis_url_parse } from '../misc'

export interface PesistentSessionData {
    jwt_token?: string
}

export interface PesistentSession {
    id: string
    data: PesistentSessionData
}

const session_namespace = "komplent"

export function psession_create(user, ip_address, initial_data = undefined as PesistentSessionData) {
    return new Promise<string>((resolve, reject) => {
        global.store.persistent_session.create({
            app: session_namespace,
            id: user.id.toString(),
            ip: ip_address,
            ttl: 7200, // seconds
            d: initial_data
        }, (err, resp) => {
            if (!err) {
                resolve(resp.token)
            } else {
                reject(err)
            }
        })
    })
}

/**
 *  To remove keys set them to null, keys that are not supplied will not be touched.
 * 
 * @param token 
 * @param data 
 * @returns the full updated data object
 */
export function psession_update(token, data: PesistentSessionData){
    return new Promise<PesistentSession>((resolve, reject) => {
        global.store.persistent_session.set({
            app: session_namespace,
            token: token,
            d: data
        }, (err, resp) => {
            if (!err) {
                resolve({id: resp.id, data: resp.d})
            } else {
                reject(err)
            }
        })
    })
}

export function psession_remove(token){
    return new Promise<number>((resolve, reject) => {
        global.store.persistent_session.kill({
            app: session_namespace,
            token: token,
        }, (err, resp) => {
            if (!err) {
                global.log.debug(`Removed session (${resp.kill}) ${token}`)
                resolve(resp.kill)
            } else {
                reject(err)
            }
        })
    })
}

export function psession_remove_by_user(user){
    return new Promise<number>((resolve, reject) => {
        global.store.persistent_session.killsoid({
            app: session_namespace,
            id: user.id.toString(),
        }, (err, resp) => {
            if (!err) {
                global.log.debug(`Removed all sessions (${resp.kill}) by ${user.id.toString()}`)
                resolve(resp.kill)
            } else {
                reject(err)
            }
        })
    })
}

export function psession_get(token){
    return new Promise<PesistentSession>((resolve, reject) => {
        global.store.persistent_session.get({
            app: session_namespace,
            token: token,
        }, (err, resp) => {
            if (!err) {
                resolve({id: resp.id, data: resp.d})
            } else {
                reject(err)
            }
        })
    })
}

export function psession_exists(token){
    return new Promise<boolean>((resolve, reject) => {
        global.store.persistent_session.get({
            app: session_namespace,
            token: token,
        }, (err, resp) => {
            if (!err) {
                if (resp.id) {
                    resolve(true)
                }
            }
            resolve(false)
        })
    })
}


export function setup_persistent_sessions(url) {
    if (!global.store.persistent_session) {

        const rs = new RedisSessions({
            namespace: "::session",
            options: {
                url
            }
        })

        global.store.persistent_session = rs

        global.log.info("Configured persistent session")
    }
}