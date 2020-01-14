import { METHOD_NOT_ALLOWED, OK, BAD_REQUEST } from 'http-status-codes'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import log from '@utility/log'
import { remove_commission_asset } from '@services/commission'

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        if (['delete'].includes(req.method)) {
            try {
                const { commission_id, asset_ids } = req.json
                return res.status(OK).json(data_message(await remove_commission_asset(req.user, commission_id, asset_ids)))

            } catch (err) {
                return res.status(BAD_REQUEST).json(error_message(err.message ?? err))
            }
        }

        return res.status(METHOD_NOT_ALLOWED).json(error_message(''))
    }
)
