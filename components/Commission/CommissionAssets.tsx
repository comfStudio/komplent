import React, { useState, useEffect } from 'react'
import { Grid, Row, Col, Uploader, Icon, Button } from 'rsuite'
import FsLightbox from 'fslightbox-react'; 

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
import { useMount } from 'react-use';

interface ProductProps {
    is_owner: boolean
    data: any
    locked?: boolean
    onClick?: Function
}

export const Asset = (props: ProductProps) => {

    const store = useCommissionStore()
    const commission = store.get_commission()
    const [ delete_loading, set_delete_loading ] = useState(false)
    const [ data, set_data ] = useState(typeof props.data === 'string' ? undefined : props.data )
    const [ loading, set_loading ] = useState(false)

    useEffect(() => {
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
        <div>
            <Image src={data?.url} h="200px" loading={loading} onClick={props.onClick} />
            <div className="mt-2">
                <Button
                    href={data?.url}
                    disabled={props.locked}
                    componentClass="a"
                    appearance="primary"
                    block
                    size="sm">{t`Download`}</Button>
                {!props.is_owner && !commission.finished && (
                    <Button
                        appearance="ghost"
                        block
                        loading={delete_loading}
                        size="sm"
                        onClick={() => {set_delete_loading(true); store.delete_product(data?._id).finally(() => { set_delete_loading(false) })}}
                        >{t`Delete`}</Button>
                )}
            </div>
        </div>
    )
}

const CommissionAssets = () => {
    const user = useUser()
    const store = useCommissionStore()
    const commission = store.get_commission()
    const [uploading, set_uploading] = useState(false)
    const [show_lightbox, set_show_lightbox] = useState(false)
    const [sources, set_sources] = useState([])

    const [ is_owner, set_is_owner ] = useState(true)

    useMount(() => {
        set_is_owner(user?._id === commission.from_user._id)
    })
    
    const products = store.state.products ?? []

    const on_upload = debounceReduce((args: any[]) => {
        const d = args.map(v => v?.data).filter(Boolean)
        if (d.length) {
            store.update({products: [...commission.products, ...d]}).finally(() => {
                set_uploading(false)
            })
        } else {
            set_uploading(false)
        }
    }, 500)

    let unlocked = store.is_unlocked(user, commission)

    return (
        <Grid fluid>
            {!commission.accepted &&
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
                        <Col key={v._id} xs={3}>
                            <Asset data={v} is_owner={is_owner} locked={!unlocked} onClick={(ev) => { ev.preventDefault(); set_show_lightbox(idx+1) }}/>
                        </Col>
                    )
                })}
                {!is_owner && (
                    <Col xs={2} key="add">
                        <div className="text-center">
                            <Upload autoUpload hideFileList multiple type="Attachment"
                            onError={() => set_uploading(false)}
                            onChange={() => set_uploading(true)}
                            onUpload={(r, f) => {
                                on_upload(r)                                
                            }}>
                                <button>
                                    <Icon icon={uploading ? "circle-o-notch" : "plus"} size="lg" spin={uploading} />
                                </button>
                            </Upload>
                        </div>
                    </Col>
                )}
            </Row>
            }
        </Grid>
    )
}

export default CommissionAssets
