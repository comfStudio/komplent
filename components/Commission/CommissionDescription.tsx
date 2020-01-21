import React, { useState, useEffect } from 'react'
import FsLightbox from 'fslightbox-react'; 
import { Grid, Row, Col, Placeholder, List, Icon, Message } from 'rsuite'

import { useCommissionStore } from '@client/store/commission'
import { PanelContainer } from '@components/App/MainLayout'
import { t } from '@utility/lang'
import { ApprovalButtons } from './CommissionProcess'
import UserInfoCard from '@components/User/UserInfoCard'
import { CommissionCard } from '@components/Profile/ProfileCommission'
import { useUser } from '@hooks/user'
import { useMessageTextToHTML } from '@hooks/db'
import { get_profile_name, price_is_null } from '@utility/misc'
import PriceSuggestionForm from '@components/Form/PriceSuggestionForm'
import UserHTMLText from '@components/App/UserHTMLText'
import Upload from '@components/App/Upload'
import { debounceReduce } from '@utility/misc'
import { Asset } from './CommissionAssets'

const CommissionDescription = () => {
    const user = useUser()
    const store = useCommissionStore()

    const [is_owner, set_is_owner] = useState(undefined)
    const [uploading, set_uploading] = useState(false)
    const [show_lightbox, set_show_lightbox] = useState(false)

    let commission = store.get_commission()

    const current_user_id = is_owner ? commission.from_user._id : commission.to_user._id

    let descr_html = useMessageTextToHTML(commission.body)

    const custom_price = price_is_null(commission.rate.price)

    const on_upload = debounceReduce((args: any[]) => {
        const d = args.map(v => v?.data).filter(Boolean)
        set_uploading(false)
        if (d) {
            store.update({attachments: [...d, ...commission.attachments]})
        }
    }, 500)

    useEffect(() => {
        set_is_owner(user._id === commission.from_user._id)
    }, [commission])

    return (
        <Grid fluid>
            <Row>
                <Col xs={24}>
                    <UserInfoCard
                        notBodyFill
                        data={is_owner === true ? commission.to_user : commission.from_user}
                        text={<span>{is_owner === true ? t`has been requested a commission from you` : t`is requesting a commission from you`}</span>}>
                        <CommissionCard
                            noCover
                            className="mt-4"
                            data={commission.rate}
                            extras={commission.extras}
                        />
                        <div className="text-center">
                        {custom_price &&
                        <>
                        <hr/>
                        <PriceSuggestionForm
                            onAcceptPrice={() => store.accept_suggested_price()}
                            onSuggestPrice={v => store.suggest_price(v)}
                            waiting={commission.suggested_price_user === current_user_id}
                            user={commission.suggested_price_user === commission.to_user._id ? commission.to_user : commission.from_user}
                            price={commission.suggested_price}/>
                        </>}
                        {is_owner === false && (
                            <div>
                                <hr />
                                <Message type="info" description={t`The commission process cannot be changed once the commission has been accepted. Make sure to review the process in Options.`} />
                                <hr />
                                {!commission.accepted && !commission.finished && (
                                    <>
                                        {custom_price && <Message className="mb-2" type="warning" description={t`Cannot approve request before a price has been decided`}/>}
                                        <p>{t`Waiting for your approval.`}</p>
                                        <p>
                                            <ApprovalButtons />
                                        </p>
                                    </>
                                )}
                                {commission.accepted && (
                                    <p>{t`You approved of this request.`}</p>
                                )}
                                {!commission.accepted &&
                                    commission.finished && (
                                        <p>{t`You declined this commission request.`}</p>
                                    )}
                            </div>
                        )}
                        </div>
                    </UserInfoCard>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <h4 className="pb-1 mb-2">{t`Information`}</h4>
                    {!!!descr_html && <Placeholder.Paragraph rows={8} />}
                    {!!descr_html && <UserHTMLText html={descr_html} />}
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <h4 className="pb-1 mb-2">{t`Attachments`}</h4>
                    <PanelContainer bordered>
                        {is_owner === true &&
                        <div className="w-128 h-32 m-auto">
                            <Upload requestData={{commission_id: commission._id, extra_data: {allowed_users: [commission.to_user._id, commission.from_user._id]}}}
                                autoUpload hideFileList multiple listType="picture-text" fluid type="Attachment"
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
                        }
                        <Grid fluid>
                            <Row>
                                {!!show_lightbox && 
                                <FsLightbox
                                sources={ commission.attachments.map( v => v?.url) }
                                type="image" 
                                types={ commission.attachments.map( v => null) }
                                slide={show_lightbox}
                                openOnMount
                                onClose = {() => set_show_lightbox(null)}
                                /> 
                                }
                                {commission.attachments.map((v, idx) => {
                                    return (
                                        <Col key={v._id} xs={12}>
                                            <Asset className="my-3" attachment data={v} deletable={is_owner} locked={false} onClick={(ev) => { ev.preventDefault(); set_show_lightbox(idx+1) }}/>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Grid>
                    </PanelContainer>
                </Col>
            </Row>
        </Grid>
    )
}

export default CommissionDescription
