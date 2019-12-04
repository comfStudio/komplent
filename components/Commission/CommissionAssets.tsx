import React, { useState } from 'react'
import { Grid, Row, Col, Uploader, Icon, Button } from 'rsuite'
import { File } from 'react-kawaii'

import Image from '@components/App/Image'
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission'
import { useUser } from '@hooks/user'
import Upload from '@components/App/Upload'
import { CenterPanel } from '@components/App/MainLayout'
import { useUpdateDatabase } from '@hooks/db'
import { update_db } from '@client/db'
import { debounceReduce } from '@utility/misc'

interface ProductProps {
    is_owner: boolean
    data: any
    locked?: boolean
}

export const Asset = (props: ProductProps) => {

    const store = useCommissionStore()
    const commission = store.get_commission()
    const [ delete_loading, set_delete_loading ] = useState(false)

    return (
        <div>
            <Image src={props?.data?.url} h="200px" />
            <div className="mt-2">
                <Button
                    href={props?.data?.url}
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
                        onClick={() => {set_delete_loading(true); store.delete_product(props.data._id).finally(() => { set_delete_loading(false) })}}
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

    let is_owner = user._id === commission.from_user._id
    const products = commission?.products ?? []

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

    return (
        <Grid fluid>
            {!commission.accepted &&
            <Row>
                <Col>
                    <CenterPanel
                        subtitle={t`Please accept the commission request to add assets`}>
                        <File mood="sad" className="emoji" color="rgba(0, 0, 0, 0.5)" />
                    </CenterPanel>
                </Col>
            </Row>}
            {commission.accepted &&
            <Row>
                {products.map(v => {
                    return (
                        <Col key={v._id} xs={3}>
                            <Asset data={v} is_owner={is_owner} />
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
