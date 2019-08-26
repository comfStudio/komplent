import { NextApiRequest, NextApiResponse } from 'next'

import '@db'
import { User } from '@db/models'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    if (req.method === 'GET') {
    const {
            query: { pid },
          } = req

    const q = await User.findOne({_id: parseInt(pid)}).lean()
    
    if (q) {
        res.status(200).json(JSON.stringify(q))
    } else {
        res.status(404).json({ error: "not found" })
    }
    
} else if (req.method === 'POST') {}
 else if (req.method === 'DELETE') {}

// const kitty = new Blog({ title: 'Test' });
// kitty.save().then(() => console.log('meow'));

res.status(404).json({ error: "error" })
}
