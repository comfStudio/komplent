import { Commission, CommissionPhase, Payment } from "@db/models"
import { decimal128ToFloat } from "@utility/misc"


export const pay_commission = async (commission_id, payment_phase_id) => {

    let c = await Commission.findById(commission_id)
    if (c) {
        let p = await CommissionPhase.findById(payment_phase_id)
        if (p) {
            let payment = new Payment({
                from_user: c.from_user,
                to_user: c.to_user,
                price: c.rate.price,
                status: "completed"
            })
            await payment.save()
            c.payments = [...c.payments, payment._id]
            await c.save()
            return true
        }
    }
    throw Error("No commission or payment phase with given IDs found")
}

export const suggest_commission_price = async (user, commission_id, new_price: number) => {

    let c = await Commission.findById(commission_id)
    if (c) {
        const valid_price = decimal128ToFloat(c.suggested_price) !== new_price && typeof new_price === 'number' && new_price >= 0
        const valid_user = [c.to_user._id.toString(), c.from_user._id.toString()].includes(user._id.toString())
        if (valid_price && valid_user) {
            c.suggested_price = new_price
            c.suggested_price_user = user
            await c.save()
            return true
        }
    } else {
        throw Error("No commission found")
    }
    return false
}

export const accept_commission_price = async (commission_id) => {

    let c = await Commission.findById(commission_id)
    if (c) {
        c.rate = { ...c.rate, price: c.suggested_price }
        await c.save()
        return true
    } else {
        throw Error("No commission found")
    }
    return false

}