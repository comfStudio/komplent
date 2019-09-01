import { NextApiRequest, NextApiResponse } from 'next'

import microCors from 'micro-cors'
import cookieParse from 'micro-cookie'

const cors = microCors({ allowMethods: ['PUT', 'POST'] })

export default cors(cookieParse(async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ title: 'Test' })
}))
