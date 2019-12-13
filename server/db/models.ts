import mongoose, { Document } from 'mongoose'
import { is_server, price_is_null } from '@utility/misc'

import {
    user_schema,
    user_store_schema,
    commission_stats_schema,
    gallery_schema,
    follow_schema,
    IUser,
    IUserModel,
} from '@schema/user'

import { message_schema, conversation_schema } from '@schema/message'
import {
    image_schema,
    attachment_schema,
    tag_schema,
    event_schema,
    notification_schema,
    text_schema,
    license_schema,
} from '@schema/general'
import {
    payout_schema,
    payment_schema
} from '@schema/monetary'
import {
    commission_schema,
    commission_extra_option_schema,
    comission_rate_schema,
    commission_phase_schema,
} from '@schema/commission'
import { schedule_unique, get_milli_secs, schedule_now } from '@server/tasks'
import { TASK, CommissionPhaseT, NSFW_LEVEL } from '@server/constants'

user_schema.pre('save', async function() {
    if (!this.name) {
        this.name = this.username
    }
    if ([NSFW_LEVEL.level_5, NSFW_LEVEL.level_10].includes(this.nsfw)) {
        let mat = await Tag.findOne({ name: 'Mature' }).lean()
        if (mat) {
            if (!this.tags) {
                this.tags = []
            }
            if (!this.tags.includes(mat._id)) {
                this.tags.unshift(mat._id)
            }
            if (this.nsfw === NSFW_LEVEL.level_10) {
                let expl = await Tag.findOne({ name: 'Explicit' }).lean()
                if (expl && !this.tags.includes(expl._id)) {
                    this.tags.unshift(expl._id)
                }
            }
        }
    }
})

commission_schema.pre('save', async function() {
    this.wasNew = this.isNew
    if (!this.commission_process || !this.commission_process.length) {
        let cp = await User.findOne({ _id: this.to_user }).select(
            'commission_process'
        )
        if (cp) {
            this.commission_process = cp.commission_process
        }
    }
    if (this.rate && !this.commission_deadline) {
        this.commission_deadline = this.rate.commission_deadline
    }
    if (this.isNew || (this.isModified('commission_deadline') && this._id)) {
        this._changed_commission_deadline = true
    }
})

commission_schema.post('save', async function() {
    if (this.wasNew) {
        let c

        if (price_is_null(this.rate.price)) {
            c = new CommissionPhase({
                type: CommissionPhaseT.negotiate,
                commission: this._id,
            })
        } else {
            c = new CommissionPhase({
                type: CommissionPhaseT.pending_approval,
                commission: this._id,
            })
            this.commission_process = this.commission_process.map(v => {
                if (v.type === CommissionPhaseT.pending_approval) {
                    v.done
                }
                return v
            })
        }

        this.phases = [c]
        c.save()
        let m = new Conversation({
            type: 'commission',
            subject: this.from_title,
            users: [this.from_user, this.to_user],
            commission: this._id,
        })
        m.save()
    }

    if (
        this._changed_commission_deadline &&
        !this.expire_date &&
        !this.finished
    ) {
        schedule_unique({
            task: TASK.commission_deadline,
            key: this._id.toString(),
            when: `${this.commission_deadline} days`,
            data: {
                commission: this.toJSON(),
                from_user_id: this.from_user,
                to_user_id: this.to_user,
            },
        })
    }
})

commission_phase_schema.pre('save', async function() {
    this.wasNew = this.isNew
    if (this.done && !this.done_date) {
        this.done_date = new Date()
    }
})

commission_phase_schema.post('save', async function() {
    const comm = await Commission.findById(this.commission)
    if (this.type == CommissionPhaseT.pending_approval) {
        if (this.done && !comm.accept_date) {
            comm.accept_date = new Date()
            comm.save()
        }
    }
    if (this.type == CommissionPhaseT.refund) {
        if (this.wasNew && !this.done) {
            comm.refunding = true
            comm.save()
            // start refund process
            schedule_unique({
                task: TASK.commission_refund,
                key: comm._id.toString(),
                when: '5 minutes',
                data: { commission: comm.toJSON(), phase: this.toJSON() },
            })
        }
        if (this.done) {
            comm.refunding = false
            comm.refunded = true
            comm.save()
        }
    }
})

image_schema.post('remove', async function() {
    if (this.paths && this.paths.length) {
        for (let p of this.paths) {
            if (p.key) {
                schedule_now({ task: TASK.cdn_delete, data: { key: p.key } })
            }
        }
    }
})

attachment_schema.post('remove', async function() {
    if (this.key) {
        schedule_now({ task: TASK.cdn_delete, data: { key: this.key } })
    }
})

comission_rate_schema.pre('save', async function() {
    if (!this.commission_deadline) {
        this.commission_deadline = 14
    }
})

comission_rate_schema.post('save', async function() {
    if (this._previous_image) {
        let im = await Image.findById({ _id: this._previous_image })
        if (im) im.remove()
    }
})

comission_rate_schema.post('remove', async function() {
    if (this.image) {
        let im = await Image.findById(this.image)
        if (im) im.remove()
    }
})

export const User = is_server()
    ? (mongoose.models.User as IUserModel) ||
      mongoose.model<IUser, IUserModel>('User', user_schema)
    : undefined
export const UserStore = is_server()
    ? mongoose.models.UserStore ||
      mongoose.model<Document>('UserStore', user_store_schema)
    : undefined
export const Follow = is_server()
    ? mongoose.models.Follow ||
      mongoose.model<Document>('Follow', follow_schema)
    : undefined
export const CommissionStats = is_server()
    ? mongoose.models.CommissionStats ||
      mongoose.model<Document>('CommissionStats', commission_stats_schema)
    : undefined
export const Commission = is_server()
    ? mongoose.models.Commission ||
      mongoose.model<Document>('Commission', commission_schema)
    : undefined
export const CommissionPhase = is_server()
    ? mongoose.models.CommissionPhase ||
      mongoose.model<Document>('CommissionPhase', commission_phase_schema)
    : undefined
export const CommissionRate = is_server()
    ? mongoose.models.CommissionRate ||
      mongoose.model<Document>('CommissionRate', comission_rate_schema)
    : undefined
export const CommissionExtraOption = is_server()
    ? mongoose.models.CommissionExtraOption ||
      mongoose.model<Document>(
          'CommissionExtraOption',
          commission_extra_option_schema
      )
    : undefined
export const Gallery = is_server()
    ? mongoose.models.Gallery ||
      mongoose.model<Document>('Gallery', gallery_schema)
    : undefined

export const Message = is_server()
    ? mongoose.models.Message || mongoose.model('Message', message_schema)
    : undefined
export const Conversation = is_server()
    ? mongoose.models.Conversation ||
      mongoose.model<Document>('Conversation', conversation_schema)
    : undefined

export const Text = is_server()
    ? mongoose.models.Text || mongoose.model<Document>('Text', text_schema)
    : undefined
export const Notification = is_server()
    ? mongoose.models.Notification ||
      mongoose.model<Document>('Notification', notification_schema)
    : undefined
export const Event = is_server()
    ? mongoose.models.Event || mongoose.model<Document>('Event', event_schema)
    : undefined
export const Tag = is_server()
    ? mongoose.models.Tag || mongoose.model<Document>('Tag', tag_schema)
    : undefined
export const Image = is_server()
    ? mongoose.models.Image || mongoose.model<Document>('Image', image_schema)
    : undefined
export const Attachment = is_server()
    ? mongoose.models.Attachment ||
      mongoose.model<Document>('Attachment', attachment_schema)
    : undefined

export const License = is_server()
    ? mongoose.models.License || mongoose.model<Document>('License', license_schema)
    : undefined


export const Payment = is_server()
    ? mongoose.models.Payment || mongoose.model<Document>('Payment', payment_schema)
    : undefined


export const Payout = is_server()
    ? mongoose.models.Payout || mongoose.model<Document>('Payout', payout_schema)
    : undefined
