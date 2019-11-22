import aws from 'aws-sdk'
import CONFIG from '@server/config'
import log from '@utility/log';

const credentials = {
   accessKeyId: CONFIG.AWS_ACCESS_KEY_ID,
   secretAccessKey: CONFIG.AWS_SECRET_KEY,
}

const bucketName = CONFIG.AWS_BUCKET_NAME

export let s3client = global.store ? global.store.s3client : undefined

export const setup_aws = () => {
    s3client = global.store.s3client = new aws.S3({
        credentials,
        endpoint: CONFIG.AWS_S3_ENDPOINT,
        s3ForcePathStyle: true,
     })
}

export const upload_file = async (data, fileName) => {
    if (s3client) {
        return new Promise<any>((resolve) => {
           s3client.upload(
              {
                 Bucket: bucketName,
                 Key: fileName,
                 Body: data,
              },
              (err, response) => {
                 if (err) throw err
                 log.debug("Uploaded file to CDN")
                 resolve(response)
              },
           )
        })
    }
}

export const delete_file = async (key) => {
   if (s3client) {
       return new Promise<any>((resolve) => {
          s3client.deleteObject(
             {
                Bucket: bucketName,
                Key: key
             },
             (err, response) => {
                if (err) throw err
                log.debug("Deleted file from CDN")
                resolve(response)
             },
          )
       })
   }
}