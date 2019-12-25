import update from 'immutability-helper'
import { Decimal128 } from 'bson'
import dinero from 'dinero.js'
import debounce from 'lodash/debounce'
import { NSFWType, NSFW_LEVEL } from '@server/constants'

export const iupdate = update

export const is_server = () => typeof window === 'undefined'

export const debounceReduce = (func, wait, combine = (acc, args) => (acc || []).concat(args)) => {
    let allArgs; // accumulator for args across calls

    const wrapper = debounce(() => func(allArgs), wait);

    return (...args) => {
      allArgs = combine(allArgs, [...args]);
      wrapper();
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

export const decimal128ToPlainString = (d: Decimal128) => decimal128ToFloat(d).toString()

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

export const price_is_null = (d) => {
    if (!d) return true
    if (typeof d === 'object') return (d['$numberDecimal'] === null || d['$numberDecimal'] === undefined)
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
    if (typeof user === 'string') user = {_id: user};
    if (typeof commission?.to_user === 'object') commission.to_user = commission.to_user._id;
    if (user?._id === commission.to_user) return commission.to_title
    return commission.from_title
}

export const get_profile_name = ({
    name = undefined,
    username = undefined,
} = {}) => {
    return name || username
}

export const get_profile_avatar_url = (profile) => {
    return profile?.avatar?.paths?.[0]?.url
}

export const get_highest_nsfw_level = (levels: NSFWType[]) => {
    if (levels?.includes(NSFW_LEVEL.level_10)) return NSFW_LEVEL.level_10
    if (levels?.includes(NSFW_LEVEL.level_5)) return NSFW_LEVEL.level_5
    return NSFW_LEVEL.level_0
}