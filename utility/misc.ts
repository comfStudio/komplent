import { useLayoutEffect as oUseLayoutEffect, useEffect } from 'react'
import crypto from 'crypto'
import update from 'immutability-helper'
import { Decimal128 } from 'bson'
import dinero from 'dinero.js'
import debounce from 'lodash/debounce'
import { NSFWType, NSFW_LEVEL } from '@server/constants'

export const iupdate = update

export const is_server = () => typeof window === 'undefined'

export const debounceReduce = (
    func,
    wait,
    combine = (acc, args) => (acc || []).concat(args)
) => {
    let allArgs // accumulator for args across calls

    const wrapper = debounce(() => func(allArgs), wait)

    return (...args) => {
        allArgs = combine(allArgs, [...args])
        wrapper()
    }
}

export const decimal128ToFloat = (d: Decimal128) => {
    let n = 0.0
    if (d !== undefined && d !== null) {
        n = parseFloat(d.toString())
        if (isNaN(n)) {
            n = parseFloat(d['$numberDecimal'])
        }
    }
    return n
}

export const decimal128ToPlainString = (d: Decimal128) =>
    decimal128ToFloat(d).toString()

export const decimal128ToMoney = (d: Decimal128) => {
    let n = dinero()
    if (d !== undefined && d !== null) {
        let s = d.toString()
        if (isNaN(parseFloat(s))) {
            s = d['$numberDecimal']
        }
        if (typeof s === 'object') {
            return decimal128ToMoney(s)
        }
        if (s.indexOf('.') == -1) {
            s += '.00'
        }

        n = dinero({ amount: parseInt(s.replace('.', '')) })
    }
    return n
}

export const stringToMoney = (n: string) => {
    return decimal128ToMoney(Decimal128.fromString(n))
}

export const stringToDecimal128 = (n: string) => {
    return Decimal128.fromString(n)
}

export const decimal128ToMoneyToString = (d: Decimal128) => {
    return moneyToString(decimal128ToMoney(d))
}

export const price_is_null = d => {
    if (!d) return true
    if (typeof d === 'object')
        return d['$numberDecimal'] === null || d['$numberDecimal'] === undefined
    return false
}

export const moneyToString = d => {
    return d?.toFormat('$0,0.00')
}

export const stringToMoneyToString = d => moneyToString(stringToMoney(d))
export const floatToMoney = d => stringToMoney(d.toString())
export const floatToMoneyToString = d => stringToMoneyToString(d.toString())

export const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function promisify_es_search(model, ...args) {
    return new Promise(function(resolve, reject) {
        model.esSearch(...args, function(err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

export const get_commission_title = (commission, user) => {
    if (typeof user === 'string') user = { _id: user }
    if (typeof commission?.to_user === 'object')
        commission.to_user = commission.to_user._id
    if (user?._id === commission.to_user && commission.to_title)
        return commission.to_title
    return commission.from_title
}

export const get_profile_name = ({
    name = undefined,
    username = undefined,
} = {}) => {
    return name || username
}

export const get_profile_avatar_url = profile => {

    return get_image_url(profile?.avatar, "icon")
}

export const get_highest_nsfw_level = (levels: NSFWType[]) => {
    if (levels?.includes(NSFW_LEVEL.level_10)) return NSFW_LEVEL.level_10
    if (levels?.includes(NSFW_LEVEL.level_5)) return NSFW_LEVEL.level_5
    return NSFW_LEVEL.level_0
}

export const generate_random_id = length => {
    var result = ''
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

export const user_among = (user: object | string, user_id_or_list: string | object | string[] | object[], raise_error=true) => {

    let err = false
    let r = false

    if (user && !user_id_or_list) {
        err = true
    }

    if (!err) {
        
            if (typeof user_id_or_list === 'string' || !Array.isArray(user_id_or_list)) {
                user_id_or_list = [user_id_or_list]
            }
        
            if (typeof user === 'object') {
                user = (user as { _id: string })._id
            }

            user_id_or_list = (user_id_or_list as any[]).map(v => typeof v === 'object' ? (v as { _id: string })._id : v)

        
            r = (user_id_or_list as string[]).includes(user)

    }

    if (err || (!r && raise_error)) {
        throw Error("User permission error")
    }
    return r
}

export const generate_unique_token = async (length = 20) => {
    return (await crypto.randomBytes(length)).toString("hex")
}

export const get_image_url = (image_data, size: undefined | 'icon' | 'thumb' | 'small' | 'medium' | 'big' | 'original' = undefined) => {
    for (let s of image_data?.paths ?? []) {
        if (size && s.size === size) {
            return s.url
        } else if (!size) {
            return s
        }
    }
}

export const useLayoutEffect = typeof window !== 'undefined' ? oUseLayoutEffect : useEffect