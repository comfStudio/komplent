import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { update_user_creds, login_user_without_password } from '@services/user'
import { User } from '@db/models'

const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { data } = req.json

            let r = {
                user: undefined,
                token: undefined
            }

            r.user = await update_user_creds(await User.findById(req.user._id).select("+password email username"), data, {randomize_username: false, require_old_password: true})
            
            if (data.password) {
                r.token = await login_user_without_password(r.user, req, res)
            }
            
            r.user = r.user.toJSON()

            res.status(OK).json(data_message(r))

        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)