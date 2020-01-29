import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'
import mongoose, { Document } from 'mongoose'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import {process_commission_stages, CommissionProcess } from '@services/commission'

const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { 
                revision_info,
                confirm_revision,
                cancel,
                revoke_complete,
                complete,
                confirm_products,
                confirm_drafts,
                skip_drafts,
                accept, 
                decline,
                process_stages, 
                data } = req.json

            let r
            if (process_stages) {
                r = await process_commission_stages(req.user, data?.stages)
            } else if (decline) {
                r = await CommissionProcess.decline_commission(req.user, data?.commission_id)
            } else if (accept) {
                r = await CommissionProcess.accept_commission(req.user, data?.commission_id)
            } else if (skip_drafts) {
                r = await CommissionProcess.skip_drafts(req.user, data?.commission_id)
            } else if (confirm_drafts) {
                r = await CommissionProcess.confirm_drafts(req.user, data?.commission_id)
            } else if (confirm_products) {
                r = await CommissionProcess.confirm_products(req.user, data?.commission_id)
            } else if (complete) {
                r = await CommissionProcess.complete(req.user, data?.commission_id)
            } else if (revoke_complete) {
                r = await CommissionProcess.revoke_complete(req.user, data?.commission_id)
            } else if (cancel) {
                r = await CommissionProcess.cancel(req.user, data?.commission_id)
            } else if (confirm_revision) {
                r = await CommissionProcess.confirm_revision(req.user, data?.commission_id)
            } else if (revision_info) {
                r = await CommissionProcess.revision_info(req.user, data?.commission_id)
            }

            res.status(OK).json(data_message(r))

        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
