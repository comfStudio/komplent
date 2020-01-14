import React, { useState, useEffect } from 'react'
import { Grid, Row, Col, Uploader, Icon, Button, Panel, IconButton, Message } from 'rsuite'
import FsLightbox from 'fslightbox-react'; 
import classnames from 'classnames'
import ImgExts from 'image-extensions'

import Image from '@components/App/Image'
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission'
import { useUser } from '@hooks/user'
import Upload from '@components/App/Upload'
import {EmptyPanel} from '@components/App/Empty'
import { CenterPanel } from '@components/App/MainLayout'
import { useUpdateDatabase } from '@hooks/db'
import { update_db } from '@client/db'
import { debounceReduce } from '@utility/misc'
import { fetch } from '@utility/request'
import { OK } from 'http-status-codes'
import { useMount } from 'react-use'
import * as pages from '@utility/pages'

interface ProductProps {
    is_owner: boolean
    data: any
    className?: string
    locked?: boolean
    onClick?: Function
}

export const Asset = (props: ProductProps) => {

    const store = useCommissionStore()
    const commission = store.get_commission()
    const [ delete_loading, set_delete_loading ] = useState(false)
    const [ data, set_data ] = useState(typeof props.data === 'string' ? undefined : props.data )
    const [ loading, set_loading ] = useState(false)
    const [ icon, set_icon ] = useState("file-o")

    useEffect(() => {

        if (props.data) {
            if (props.data.name) {
                let ext = [...ImgExts]
                let n = props.data.name.toLowerCase()
                while (ext.length) {
                    if (n.endsWith(ext.pop())) {
                        ext = []
                        set_icon("file-image-o")
                    }
                }   
            }
        }

        if (!props.locked && typeof props.data === 'string') {
            set_loading(true)
            fetch('/api/fetch', {
                method: 'post',
                body: {
                    model: 'Attachment',
                    method: 'findById',
                    query: props.data,
                }}).then(r => {
                    if (r.status === OK) {
                        r.json().then(d => set_data(d.data))
                    }
                    set_loading(false)
                })
        }
    }, [props.data])

    return (
        <Panel bordered bodyFill className={classnames(props.className, "hover:bg-gray-100 cursor-pointer")} onClick={props.onClick}>
            <div className="flex content-center w-full h-12">
                <Icon className="muted self-center " icon={icon as any} size="3x"/>
                <span className="flex-grow mx-4 self-center truncate">{data?.name}</span>
                <span className="self-center p-3 flex">
                    <IconButton
                        icon={<Icon icon="file-download" />}
                        href={data?.url}
                        disabled={props.locked}
                        componentClass="a"
                        appearance="primary"
                        size="sm"/>
                    {!props.is_owner && !commission.finished && (
                        <IconButton
                            icon={<Icon icon="close" />}
                            loading={delete_loading}
                            className="mx-3"
                            size="sm"
                            onClick={() => {set_delete_loading(true); store.delete_product(data?._id).finally(() => { set_delete_loading(false) })}}
                            />
                    )}
                </span>
            </div>
        </Panel>
    )
}

const CommissionAssets = () => {
    const user = useUser()
    const store = useCommissionStore()
    const commission = store.get_commission()
    const [uploading, set_uploading] = useState(false)
    const [show_lightbox, set_show_lightbox] = useState(false)
    const [sources, set_sources] = useState([])
    const [ unlocked_to_owner, set_unlocked_to_owner ] = useState(false)

    const [ is_owner, set_is_owner ] = useState(true)

    useMount(() => {
        set_is_owner(user?._id === commission.from_user._id)
        set_unlocked_to_owner(store.is_unlocked(commission.from_user, commission))
    })
    
    const products = store.state.products ?? []

    const on_upload = debounceReduce((args: any[]) => {
        const d = args.map(v => v?.data).filter(Boolean)
        set_uploading(false)
        if (d) {
            store.setState({products: [...d, ...store.state.products]})
        }
    }, 500)

    let unlocked = store.is_unlocked(user, commission)

    return (
        <Grid fluid>
            <Row>
                <Col xs={24} className="mb-4">
                    {!unlocked_to_owner && !is_owner &&
                    <Message type="info" description={t`Assets are locked and cannot be accessed by the client.`}/>
                    }
                    {unlocked_to_owner && !is_owner &&
                    <Message type="success" description={t`Assets are unlocked and can be accessed by the client.`}/>
                    }
                </Col>
            </Row>
            {!commission.accepted && !is_owner &&
            <Row>
                <Col xs={24}>
                    <EmptyPanel type="confirmation" subtitle={t`Please accept the commission request to add assets`}/>
                </Col>
            </Row>}
            {!unlocked &&
            <Row>
                <Col xs={24}>
                    <EmptyPanel type="security" subtitle={t`Assets are locked`}/>
                    <hr/>
                </Col>
            </Row>}
            {commission.accepted && !is_owner &&
            <Row>
                <Col xs={24} key="add" className="text-center mb-2">
                    <div className="w-128 h-32 m-auto">
                        <Upload action={pages.asset_upload} requestData={{commission_id: commission._id}} autoUpload hideFileList multiple listType="picture-text" fluid type="Attachment"
                        onError={() => set_uploading(false)}
                        onChange={() => set_uploading(true)}
                        onUpload={(r, f) => {
                            on_upload(r)
                        }}>
                            <div>
                                <p>
                                {t`Click or drag files to this area to upload`}
                                </p>
                                <Icon icon={uploading ? "circle-o-notch" : "file-upload"} size="lg" spin={uploading} />
                            </div>
                        </Upload>
                    </div>
                </Col>
            </Row>
            }
            {commission.accepted &&
            <Row>
                {!!show_lightbox && 
                 <FsLightbox
                 sources={ products.map( v => v?.url) }
                 type="image" 
                 types={ products.map( v => null) }
                 slide={show_lightbox}
                 openOnMount
                 onClose = {() => set_show_lightbox(null)}
                 /> 
                }
                {products.map((v, idx) => {
                    return (
                        <Col key={v._id} xs={12}>
                            <Asset className="my-3" data={v} is_owner={is_owner} locked={!unlocked} onClick={(ev) => { ev.preventDefault(); set_show_lightbox(idx+1) }}/>
                        </Col>
                    )
                })}
            </Row>
            }
        </Grid>
    )
}

export default CommissionAssets
