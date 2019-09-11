import { NextApiRequest, NextApiResponse } from 'next'

import { error_message, data_message } from '@utility/message'
import { User } from '@db/models'
import { NOT_FOUND, OK } from 'http-status-codes';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (await User.check_exists({username:req.query.username, email:req.query.email})) {
        res.status(OK).json(data_message("User found"))
    } else {
        res.status(NOT_FOUND).json(error_message("User not found"))
    }
}
