import aws from 'aws-sdk'
import CONFIG from '@server/config'
import log from '@utility/log'
import fs, { ReadStream } from 'fs'
import { is_server } from '@utility/misc'
import { UploadType } from '@server/constants'

const sharp = is_server() ? require('sharp') : undefined

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
        return new Promise<any>(resolve => {
            s3client.upload(
                {
                    Bucket: bucketName,
                    Key: fileName,
                    Body: data,
                },
                (err, response) => {
                    if (err) throw err
                    log.debug('Uploaded file to CDN')
                    resolve(response)
                }
            )
        })
    }
}

export const delete_file = async key => {
    if (s3client) {
        return new Promise<any>(resolve => {
            s3client.deleteObject(
                {
                    Bucket: bucketName,
                    Key: key,
                },
                (err, response) => {
                    if (err) throw err
                    log.debug('Deleted file from CDN')
                    resolve(response)
                }
            )
        })
    }
}

export const generate_image_sizes = async (path: string, {sizes = ["icon", "thumb", "medium", "small", "big", "original"], upload = true, name = "", type = undefined as UploadType}) => {
    let filebuffer: Buffer

    if (name) {
        log.debug(`Generating image sizes for ${name}`)
    }
    switch (type) {
        case UploadType.Generic:
            sizes = ["medium"]
            break;
        case UploadType.Gallery:
            sizes = ["thumb", "medium", "small", "big"]
            break;
        case UploadType.ProfilePicture:
            sizes = ["icon"]
            break;
        case UploadType.ProfileCover:
            sizes = ["medium", "big"]
            break;
        case UploadType.CommissionRate:
        sizes = ["thumb", "small"]
            break;
        default:
            break;
    }

    let generated = false

    const results = []

    const resize_img = async (width, height, buffer, opts) => {

        if (!width && !height) {
            log.debug("width and height are null, will not resize")
            if (typeof buffer === 'string') {
                return sharp(buffer).toBuffer()
            }
            return buffer
        }
        
        const s = sharp(buffer)
        const metadata = await s.metadata()
        
        if (metadata.width < width && metadata.height < height) {
            log.debug("width and height are less then given dimensions, will not resize")
            return null
        } else {
            log.debug("width and height are less then given dimensions, will resize")
            return await s.resize({
                width,
                height,
                ...opts,
                withoutEnlargement: true,
                }).toBuffer()
        }

    }

    const gen = async (size, width, height, opts, push = true) => {

        log.debug(`generating image size: ${size}`)
        
        let r = {
            buffer: undefined,
            size: size,
            data: undefined
        }
        
        log.debug(`attempting to resize`)
        r.buffer = await resize_img(width, height, filebuffer ?? path, opts)

        if (r.buffer) {
            log.debug("generated a resized stream")
            generated = true
        }
    
        if (upload && r.buffer && name)  {
            const i_name =  size === 'original' ? name : (`${size}_`+name)
            log.debug(`uploading image ${i_name}`)
            const u = await upload_file(r.buffer, i_name)
            r.data = { url: u.Location, key: u.Key }
            
        }
    
        if (r.buffer) {
            filebuffer = r.buffer
        }

        if (push) {
            results.push(r)
        }

        return r
    }

    if (sizes.includes("original")) {
        await gen("original", null, null, { fit: "inside" })
    }

    if (sizes.includes("big")) {
        await gen("big", 1200, 1500, { fit: "inside" })
    }

    if (sizes.includes("medium")) {
        await gen("medium", 750, 1000, { fit: "inside" })
    }

    if (sizes.includes("small")) {
        await gen("small", 500, 700, { fit: "inside" })
    }

    if (sizes.includes("thumb")) {
        await gen("thumb", 250, 300, { fit: "cover" })
    }

    if (sizes.includes("icon")) {
        await gen("icon", 100, 100, { fit: "cover" })
    }

    let any

    if (!generated) {
        any = await gen("any", null, null, { fit: "inside" }, false)
    }

    for (let i = 0; i < results.length; i++) {
        let r = results[i]
        if (r.buffer === null) {
            if (results[i+1] && results[i+1].data) {
                r.data = {...results[i+1].data}
                r.data.size = r.size
            }

            if (!r.data && results[i-1] && results[i-1].data) {
                r.data = {...results[i-1].data}
                r.data.size = r.size
            }

            if (!r.data && any) {
                r.data = {...any.data}
                r.data.size = r.size
            }
        }
    }

    log.debug(`generated images: ${results.map(v => v.size)}`)

    return results.filter(v => v.size !== "any")
}