import { Event } from '@db/models'
import { EVENT } from '@server/constants'

export async function setup_streams() {
    Event.watch().on("change", (data => {
        if (data.fullDocument) {
            let d = data.fullDocument
            switch(d.type) {
                case EVENT.changed_commission_status:
                    console.log("yes")
                    break
            }
        }
    }))
}