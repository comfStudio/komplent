import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'

import {
    with_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { error_message, data_message } from '@utility/message'
import * as tasks from '@server/tasks'
import log from '@utility/log'

export default with_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { method, args } = req.json

            let fn = tasks[method]
            if (!fn) {
                throw Error(`Invalid method ${method}`)
            }
            let d

            if (req.method === 'post') {
                log.debug(`Posting task ${args.task}`)
                d = await fn(args)
                if (d) {
                    d = d.id
                }
            } else {
                // Handle the rest of your HTTP methods
            }

            res.status(OK).json(data_message(d))
        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
