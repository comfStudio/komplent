import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes'

import { with_user, UserApiRequest, JSONApiRequest, with_json } from '@server/middleware'
import { error_message, message } from '@utility/message'
import { User } from '@db/models'
import { create_user } from '@server/db'

const cors = microCors({ allowMethods: ['POST'] })

export default cors(with_user(with_json(async (req: UserApiRequest & JSONApiRequest, res: NextApiResponse) => {
    if (!req.user) {
        try {
            const { email, username, password } = req.json
            if (email && username && password) {
                if (!(await User.check_exists({email:email, username:username}))) {
                    await create_user({username:username, email:email, password:password})
                    res.status(OK).json(message("Joined"))
                } else {
                res.status(BAD_REQUEST).json(error_message("User already exists"))
                }
            } else {
                res.status(BAD_REQUEST).json(error_message("Missing user credentials"))
            }
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }

    } else {
        res.status(BAD_REQUEST).json(error_message("Already logged in"))
    }
}), false))
