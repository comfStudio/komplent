import { Payout } from "@db/models"

export const start_payout = (user) => {
    if (!await Payout.latest_payout(user, "pending")) {
    }
}
