import { Commission, CommissionPhase, Payment } from "@db/models"


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