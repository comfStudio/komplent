import { NextApiRequest, NextApiResponse } from 'next'

import '@db'
import { Blog } from '@db/models'

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
    // Process your POST request
    } else {
    // Handle the rest of your HTTP methods
    }

    const kitty = new Blog({ title: 'Test' });
    kitty.save().then(() => console.log('meow'));

  res.status(200).json({ title: 'Test' })
}
