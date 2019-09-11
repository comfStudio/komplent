import { NextApiRequest, NextApiResponse } from 'next'

import microCors from 'micro-cors'

import { with_user, with_json, UserApiRequest, JSONApiRequest } from '@server/middleware'

const cors = microCors({ allowMethods: ['PUT', 'POST'] })

export default with_user(with_json(async (req: UserApiRequest & JSONApiRequest, res: NextApiResponse) => {
    res.status(200).json([])
}), false)
