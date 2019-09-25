import update from 'immutability-helper';
import { Decimal128 } from 'bson';
import dinero from 'dinero.js'

export const iupdate = update

export const is_server = () => typeof window === 'undefined'

export const decimal128ToFloat = (d: Decimal128) => {
    let n = 0.0
    if (d !== undefined) {
        n = parseFloat(d.toString())
        if (isNaN(n)) {
            n = parseFloat(d['$numberDecimal'])
        }
    }
    return n
}

export const decimal128ToMoney = (d: Decimal128) => {
    let n = dinero()
    if (d !== undefined) {
        let s = d.toString()
        if (isNaN(parseFloat(s))) {
            s = d['$numberDecimal']
        }
        if (s.indexOf('.') == -1) {
            s += '.00'
        }

        n = dinero({amount: parseInt(s.replace('.', ''))})
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

export const moneyToString = (d) => {
    return d.toFormat('$0,0.00')
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}