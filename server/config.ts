import { is_server } from '@utility/misc'

export const CONFIG = {
    REDIS_URL: process.env.REDIS_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    ELASTIC_URL: process.env.ELASTIC_URL,
    PRIMUS_1_HOST: process.env.PRIMUS_1_HOST,
    PRIMUS_1_PORT: process.env.PRIMUS_1_PORT,
    RUNNING: process.env.RUNNING,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
}

export default CONFIG
