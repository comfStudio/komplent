import { NextApiRequest, NextApiResponse } from 'next'

import microCors from 'micro-cors'

import { with_user } from '@server/auth'

const cors = microCors({ allowMethods: ['PUT', 'POST'] })

export default with_user(async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json([])
}, false)
