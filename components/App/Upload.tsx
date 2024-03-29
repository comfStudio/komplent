import React, { useRef, useState, useEffect } from 'react';
import classnames from 'classnames'
import { Uploader, Icon } from 'rsuite';
import { get_authorization_header } from '@utility/request';
import * as pages from '@utility/pages'
import { FileType } from 'rsuite/lib/Uploader';
import { useUser } from '@hooks/user';
import { is_server } from '@utility/misc';
import { ReactProps, HTMLElementProps } from '@utility/props';
import { UploadType } from 'aws-sdk/clients/devicefarm';
import { html_image_accept_types } from '@client/helpers';

export interface UploadProps extends ReactProps {
    fluid?: boolean
    action?: string
    className?: string
    defaultData?: any
    requestData?: object
    type?: "Image" | "Attachment"
    listType?: "picture" | "picture-text" | "text"
    multiple?: boolean
    uploadType?: UploadType
    autoUpload?: boolean
    hideFileList?: boolean
    onChange?: (filelist: FileType[]) => void
    onRemove?: (file: FileType) => void
    onUpload?: (response, file: FileType) => void
    onError?: (reason, file: FileType) => void
}

const Upload = React.forwardRef((({type = "Image", listType = "picture", autoUpload = false, ...props}: UploadProps = {}, ref) => {

    const [default_filelist, set_default_filelist] = useState([])
    const [filelist, set_filelist] = useState([])

    const user = useUser()
    
    useEffect(() => {
        if (props.defaultData) {
            if (props.defaultData.image?.paths?.length) {
                set_default_filelist([
                    {
                        name: 'image_' + props.defaultData?._id,
                        fileKey: 1,
                        url: props.defaultData.image.paths[0].url,
                    },
                ])
            } else {
                set_default_filelist([])
            }
        }
    }, [props.defaultData])

    const el = props.children ? props.children : <button type="button"><Icon icon={props.multiple ? "file-upload" : "camera-retro"} size="lg" /></button>

    return (
        <Uploader
            fluid
            className={classnames({"fluid-uploader": props.fluid}, props.className)}
            data={{user: user?._id, type, ...props.requestData, upload_type: props.uploadType}}
            dragable
            action={props.action ?? pages.upload}
            ref={ref}
            accept={type === 'Image' ? html_image_accept_types : undefined}
            listType={listType}
            fileList={filelist.length ? filelist : default_filelist}
            autoUpload={autoUpload}
            multiple={props.multiple}
            fileListVisible={!props.hideFileList}
            withCredentials={true}
            headers={!is_server() ? get_authorization_header() : undefined}
            onError={props.onError}
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
            {el}
        </Uploader>
    )
}))
Upload.displayName = 'Upload'

export default Upload;