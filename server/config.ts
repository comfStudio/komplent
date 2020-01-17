import getConfig from 'next/config'
import { is_server } from '@utility/misc'

const {
    publicRuntimeConfig,  // Available both client and server side
  } = getConfig()

export const CONFIG = {
    URL: process.env.URL || 'http://localhost:3000',
    REDIS_URL: process.env.REDIS_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    ELASTIC_URL: process.env.ELASTIC_URL,
    PRIMUS_1_HOST: process.env.PRIMUS_1_HOST,
    PRIMUS_1_PORT: process.env.PRIMUS_1_PORT,
    RUNNING: process.env.RUNNING,
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
    EMAIL_SENDGRID: process.env.EMAIL_SENDGRID === 'true',
    EMAIL_DOMAIN: process.env.EMAIL_DOMAIN,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : undefined,
    EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    JWT_KEY: process.env.JWT_KEY,
    SESSION_KEYS: publicRuntimeConfig?.SESSION_KEYS?.split(','),
}

export default CONFIG
