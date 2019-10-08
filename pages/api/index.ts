import { NextApiRequest, NextApiResponse } from 'next'

import '@db'
import { User } from '@db/models'
import { with_middleware, ExApiRequest } from '@server/middleware'


export default with_middleware((req: ExApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
    // Process your POST request
    } else {
    // Handle the rest of your HTTP methods
    }

  res.status(200).json({ title: 'Test' })
})
