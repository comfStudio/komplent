import React, { useState } from 'react'
import { Row, Col, Panel, Icon, FlexboxGrid, Button } from 'rsuite'
import FsLightbox from 'fslightbox-react'; 
import classnames from 'classnames'

import { Image } from '@components/App/Image'
import { GridContainer } from '@components/App/MainLayout'
import { HTMLElementProps } from '@app/utility/props'
import Upload from '@components/App/Upload'
import { debounceReduce, get_image_url } from '@utility/misc'
import { t } from '@utility/lang'
import { useProfileUser } from '@hooks/user'
import * as pages from '@utility/pages'
import { useGalleryStore } from '@store/profile'
import './profile.scss'

const Gallery = (props: {data: any, user?: any, profile_owner?: boolean, store: any, onClick?: any}) => {
    const [loading, set_loading] = useState(false)

    const src = get_image_url(props.data?.image, "thumb")

    return (
        <Panel bordered bodyFill className={classnames("gallery", {"cursor-pointer": !!props.onClick})}>
            <div onClick={props.onClick}>
                {!!src && <Image src={src} w={250} h={200} />}
                {!src && <p className="p-10 text-lg muted">{t`Processing...`}</p>}
            </div>
            {props.profile_owner &&
            <Button color="red" size="xs" loading={loading} onClick={() => {
                set_loading(true)
                props.store.delete_gallery(props.data._id).then(r => set_loading(false))
            }} block>{t`Delete`}</Button>}
        </Panel>
    )
}

interface Props extends HTMLElementProps {
    fluid?: boolean
}

export const GalleryList = () => {

    const { current_user, context: { profile_owner }} = useProfileUser()
    const store = useGalleryStore()
    const [show_lightbox, set_show_lightbox] = useState(false)

    return (
        <FlexboxGrid>
            {!!show_lightbox && 
                <FsLightbox
                sources={ store.state.galleries.map( v => get_image_url(v.image, "big")) }
                type="image"
                types={ store.state.galleries.map( v => null) }
                slide={show_lightbox}
                openOnMount
                onClose = {() => set_show_lightbox(null)}
                /> 
            }
            {store.state.galleries.map((g, idx) => (
                <FlexboxGrid.Item key={g._id} componentClass={Col} colspan={6} md={4}>
                    <Gallery data={g} user={current_user} store={store} profile_owner={profile_owner} onClick={() => { set_show_lightbox(idx+1) }} />
                </FlexboxGrid.Item>
            ))}
        </FlexboxGrid>
    )
}

export const ProfileGallery = (props: Props) => {
    const { context: { profile_owner }} = useProfileUser()
    const store = useGalleryStore()

    const [uploading, set_uploading] = useState(false)

    const on_upload = debounceReduce((args: any[]) => {
        const d = args.map(v => v?.data).filter(Boolean)
        set_uploading(false)
        if (d) {
            store.setState({galleries: [...d, ...store.state.galleries]})
        }
    }, 500)

    return (
        <GridContainer fluid={props.fluid}>
            {profile_owner && 
            <Row>
                <Col xs={24} className="text-center mb-2">
                    <div className="w-128 h-32 m-auto">
                        <Upload action={pages.gallery_upload} autoUpload hideFileList multiple listType="picture-text" fluid type="Image"
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
            <Row>
                <GalleryList/>
            </Row>
        </GridContainer>
    )
}

export default ProfileGallery
