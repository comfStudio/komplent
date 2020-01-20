import fs from 'fs'
import path from 'path'

import { Commission, CommissionPhase, Payment, Attachment } from "@db/models"
import { decimal128ToFloat, user_among } from "@utility/misc"
import { upload_file } from '@services/aws'
import log from '@utility/log'
import { schedule_unique, remove_unique_task, schedule_unique_now } from '@server/tasks'
import { TASK } from '@server/constants'
import fairy from '@server/fairy'
import { addDays } from 'date-fns'

export const add_commission_asset = async (user, commission, file) => {

    user_among(user, commission.to_user)

    const filestream = fs.createReadStream(file.path)
    const r = await upload_file(filestream, path.basename(file.path)).finally(() => {
        filestream.destroy()
    })
    
    if (r) {
        const asset = new Attachment({ name: file.name, url: r.Location, key: r.Key, allowed_users: [user._id, commission.from_user] })
        await asset.save()
        commission.products.push(asset)
        await commission.save()
        log.debug(`Asset added to commission ${commission._id}`)
        return asset
    } else {
        throw Error("no asset was added")
    }

}

export const remove_commission_asset = async (user, commission_id: string, asset_ids: string[], key=undefined) => {

    key = key ?? "products"

    const commission = await Commission.findById(commission_id)

    if (!commission) {
        throw Error("no commission found")
    }

    user_among(user, key === 'attachments' ? commission.from_user : commission.to_user)

    for (let aid of asset_ids) {
        if (commission[key].includes(aid)) {
            await Attachment.findByIdAndDelete(aid)
            commission[key].remove(aid)
        } else {
            throw Error("permission error")
        }
    }

    await commission.save()

    return true
}

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

const schedule_expire_deadline = (commission_id: string, created: Date, deadline: number) => {
    if (deadline && deadline > 0) {
        if (addDays(created, deadline) < (new Date())) {
            return schedule_unique_now({
                task: TASK.commission_request_deadline,
                key: commission_id.toString(),
                data: {
                    commission_id,
                },
            })
        } else {
            return schedule_unique({
                task: TASK.commission_request_deadline,
                key: commission_id.toString(),
                when: `${deadline} days`,
                data: {
                    commission_id,
                },
            })
        }
    } else {
        remove_unique_task(TASK.commission_request_deadline, commission_id)
    }
}

export const create_commission = async (from_user, data: any) => {

    const c = new Commission(data)

    await c.save()

    schedule_expire_deadline(c._id, c.created, from_user.request_expire_deadline)

    return c
}

export const update_requests_expire_deadline = async (user_id: string, new_deadline: number) => {

    const requests = await Commission.find({to_user: user_id, finished: false, accepted: false}).select("_id created").lean()

    requests.forEach(c => {
        schedule_expire_deadline(c._id, c.created, new_deadline)
    });

}

export const configure_commission_fairy_handlers = () => {
    
    fairy()?.on("user_request_expire_deadline_changed", (user, new_deadline) => {
        update_requests_expire_deadline(user._id, new_deadline)
    })

}