import { NextApiRequest, NextApiResponse } from 'next'
import { NOT_FOUND, OK } from 'http-status-codes';

import { error_message, data_message } from '@utility/message'
import { User } from '@db/models'
import { with_middleware, ExApiRequest } from '@server/middleware'



export default with_middleware(async (req: ExApiRequest, res: NextApiResponse) => {
    let q = {username:req.query.username, email:req.query.email}
    if (q.username || q.email) {
        if (await User.check_exists(q)) {
            return res.status(OK).json(Object.assign(data_message("User found")))
        }
    } else if (req.user) {
        return res.status(OK).json(Object.assign(data_message("User found"), {user:req.user}))
    }
    res.status(NOT_FOUND).json(error_message("User not found"))
})