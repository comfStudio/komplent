import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK } from 'http-status-codes'

import { with_middleware, ExApiRequest } from '@server/middleware'
import { error_message, data_message } from '@utility/message'
import { User } from '@db/models'
import { update_user_creds, login_user_without_password } from '@services/user'

const cors = microCors({ allowMethods: ['POST'] })

export default with_middleware(
    async (req: ExApiRequest, res: NextApiResponse) => {

        const { accessToken, provider, user_id, ...data } = req.json

        let user = req.user
        if (!user) {
            user = await User.findById(user_id)
        }

        let ok = false
        for (let v of user.oauth_data) {
            if (v.provider === provider && v.accessToken === accessToken) {
                ok = true
            }
        }

        try {
            if (!ok) {
                throw Error("Invalid token")
            }

            await update_user_creds(user, data, {save: true, randomize_username: false})
            const token = await login_user_without_password(user, req, res)
            res.status(OK).json(data_message({ token }))
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
