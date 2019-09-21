import update from 'immutability-helper';
import { Decimal128 } from 'bson';

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