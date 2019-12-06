import { Payout } from "@db/models"
import { get_payout_balance } from "./analytics"
import { schedule_now, schedule } from "@server/tasks"
import { stringToDecimal128 } from "@utility/misc"
import { minimumPayoutBalance, TASK } from "@server/constants"

export const create_payout = async user => {
    if (!await Payout.latest_payout(user, "pending")) {
        const balance = await get_payout_balance(user)
        if (balance.total_balance > stringToDecimal128(minimumPayoutBalance.toString())) {
            let p = new Payout({
                fund: balance.total_balance,
                from_date: balance.from_date,
                to_date: balance.to_date,
                user
            })
            await p.save()
    
            schedule({when: "1 minute", task: TASK.payout_user, data: {payout_id: p._id}})

            return true

        } else {
            throw Error("Payout balance is below the minimum threshold")
        }
    }
    return false
}
