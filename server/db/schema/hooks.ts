import { price_is_null } from '@utility/misc'

import {
    user_schema,
} from '@schema/user'

import {
    image_schema,
    attachment_schema,
    gallery_schema,
} from '@schema/general'
import {
    commission_schema,
    comission_rate_schema,
    commission_phase_schema,
} from '@schema/commission'

import { schedule_unique, schedule_now } from '@server/tasks'
import { TASK, CommissionPhaseT, NSFW_LEVEL } from '@server/constants'
import { CommissionPhase, Conversation, Commission, Image, Tag, User, Attachment, Follow } from '@db/models'
import { update_price_stats, update_delivery_time_stats } from '@services/analytics'
import fairy from '@server/fairy'
import { message_schema, conversation_schema } from './message'

user_schema.pre('save', async function() {
    if (!this.name) {
        this.name = this.username
    }

    if (this.commissions_open === true) {
        let prev_user = await User.findById(this._id).lean()
        if (prev_user && prev_user.commissions_open === false) {
            this.last_open_status = new Date()
        }
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

    if (!this.isNew) {
        if (this.isModified("email")) {
            fairy().emit("user_email_changed", this, this.email)
        }
    }

    if (this.commissions_open) {
        if (!this.email_verified) {
            this.commissions_open = false
        }
    }

    if (this.wasNew) {
        fairy().emit("user_joined", this)
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

    if (this.finished && this.drafts.length) {
        for (let d of this.drafts) {
            Attachment.findByIdAndDelete(d)
        }
        this.drafts = []
    }

})

commission_schema.post('save', async function() {
    if (this.wasNew) {
        let c
        
        let user = await User.findById(this.to_user)
        if (user) {
            user.last_commissioned = new Date()
            user.save()
        }

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

gallery_schema.post('remove', async function() {
    if (this.image) {
        const im = await Image.findById(this.image)
        if (im) im.remove()
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

    update_price_stats(this.user)
    update_delivery_time_stats(this.user)
})

comission_rate_schema.post('remove', async function() {
    if (this.image) {
        let im = await Image.findById(this.image)
        if (im) im.remove()
    }

    update_price_stats(this.user)
    update_delivery_time_stats(this.user)
})

message_schema.pre('save', async function() {
    if (this.isNew) {
        Conversation.findByIdAndUpdate(this.conversation, { last_message: new Date() })
    }
})

conversation_schema.pre('save', async function() {
    if (this.isNew) {
        Conversation.findByIdAndUpdate(this.conversation, { last_message: new Date() })
    }
})
