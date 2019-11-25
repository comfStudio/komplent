import React, { useRef, useState, useEffect } from 'react';
import { Uploader, Icon } from 'rsuite';
import { get_authorization_header } from '@utility/request';
import * as pages from '@utility/pages'
import { FileType } from 'rsuite/lib/Uploader';
import { useUser } from '@hooks/user';
import { is_server } from '@utility/misc';

export interface UploadProps {
    defaultData?: any
    requestData?: object
    type?: "Image" | "Attachment"
    multiple?: boolean
    onChange?: (filelist: FileType[]) => void
    onRemove?: (file: FileType) => void
    onUpload?: (response, file: FileType) => void
}

const Upload = React.forwardRef((({type = "Image", ...props}: UploadProps = {}, ref) => {

    const [default_filelist, set_default_filelist] = useState([])
    const [filelist, set_filelist] = useState([])

    const user = useUser()
    
    useEffect(() => {
        if (props.defaultData) {
            if (props.defaultData.image?.paths?.length) {
                set_default_filelist([
                    {
                        name: 'image_' + props.defaultData._id,
                        fileKey: 1,
                        url: props.defaultData.image.paths[0].url,
                    },
                ])
            } else {
                set_default_filelist([])
            }
        }
    }, [props.defaultData])

    return (
        <Uploader
            fluid
            data={{user: user?._id, type, ...props.requestData}}
            action={pages.upload}
            ref={ref}
            accept="image/*"
            listType="picture"
            fileList={filelist.length ? filelist : default_filelist}
            autoUpload={false}
            multiple={props.multiple}
            withCredentials={true}
            headers={!is_server() ? get_authorization_header() : undefined}
            onRemove={props.onRemove}
            onChange={f => {
                let d = f
                if (!props.multiple) {
                    d = [f[f.length - 1]]
                }
                set_filelist(d)
                if (props.onChange) {
                    props.onChange(d)
                }
            }}
            onSuccess={(r, f) => {
                if (props.onUpload) {
                    props.onUpload(r, f)
                }
            }}>
            <button type="button">
                <Icon icon="camera-retro" size="lg" />
            </button>
        </Uploader>
    )
}))
Upload.displayName = 'Upload'

export default Upload;