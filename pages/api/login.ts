import { NextApiRequest, NextApiResponse } from 'next'

import microCors from 'micro-cors'
import cookieParse from 'micro-cookie'

import queryParse from 'micro-query'

import { with_user } from '@server/auth'

const cors = microCors({ allowMethods: ['PUT', 'POST'] })

export default with_user(async (req: NextApiRequest, res: NextApiResponse) => {
    const q = queryParse(req)
    res.status(200).json(q)
}, false)
