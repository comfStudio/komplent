import { NextApiResponse } from 'next'
import microCors from 'micro-cors'
import { BAD_REQUEST, OK } from 'http-status-codes'
import { json } from 'micro'

import { with_user, UserApiRequest } from '@server/auth'
import { error_message, message } from '@utility/message'
import { User } from '@db/models'

const cors = microCors({ allowMethods: ['POST'] })

export default cors(with_user(async (req: UserApiRequest, res: NextApiResponse) => {
    if (!req.user) {
        try {
            const { email, username, password } = await json(req)
            if (email && username && password) {
                if (!(await User.exists({email:email, username:username}))) {
                    res.status(OK).json(message("Joined"))
                } else {
                res.status(BAD_REQUEST).json(error_message("User already exists"))
                }
            } else {
                res.status(BAD_REQUEST).json(error_message("Missing user credentials"))
            }
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.msg))
        }

    } else {
        res.status(BAD_REQUEST).json(error_message("Already logged in"))
    }
}, false))
