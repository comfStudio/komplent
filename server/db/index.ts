import mongoose from 'mongoose'
import {
    STATES,
} from '@server/constants'

export async function connect(MONGODB_URL) {
    console.log(MONGODB_URL)
    if (MONGODB_URL) {
        if (mongoose.connection.readyState == 0) {
            await mongoose.connect(MONGODB_URL, {
                useNewUrlParser: true,
            })
            STATES.MONGODB_CONNECTED = true
        } else {
            STATES.MONGODB_CONNECTED = true
        }
    }
}
