import update from 'immutability-helper'
import { Decimal128 } from 'bson'
import dinero from 'dinero.js'
import debounce from 'lodash/debounce'

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

export const decimal128ToMoney = (d: Decimal128) => {
    let n = dinero()
    if (d !== undefined && d !== null) {
        let s = d.toString()
        if (isNaN(parseFloat(s))) {
            s = d['$numberDecimal']
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

export const moneyToString = d => {
    return d.toFormat('$0,0.00')
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

export const tuple = <T extends string[]>(...args: T) => args

export function array_to_enum<T extends string>(o: Array<T>): { [K in T]: K } {
    return o.reduce((res, key) => {
        res[key] = key
        return res
    }, Object.create(null))
}

export const get_profile_name = ({
    name = undefined,
    username = undefined,
} = {}) => {
    return name || username
}
