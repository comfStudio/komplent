import { NOT_FOUND, OK } from 'http-status-codes';
import microCors from 'micro-cors'

import { error_message, data_message } from '@utility/message'
import { with_auth_middleware, ExApiRequest, ExApiResponse } from '@server/middleware'

const cors = microCors({ allowMethods: ['PUT'] })

export default with_auth_middleware(async (req: ExApiRequest, res: ExApiResponse) => {
    console.log(req.json)
    res.status(OK).json(data_message("updated"))
})