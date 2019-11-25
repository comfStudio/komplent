import { NextApiRequest, NextApiResponse } from 'next'

import '@db'
import { User } from '@db/models'

import { with_middleware, ExApiRequest } from '@server/middleware'

export default with_middleware(
    async (req: ExApiRequest, res: NextApiResponse) => {
        if (req.method === 'GET') {
            const {
                query: { pid },
            } = req

            const q = await User.findOne({ username: pid }).lean()

            if (q) {
                res.status(200).json(JSON.stringify(q))
            } else {
                res.status(404).json({ error: 'not found' })
            }
        } else if (req.method === 'POST') {
        } else if (req.method === 'DELETE') {
        }
    }
)
