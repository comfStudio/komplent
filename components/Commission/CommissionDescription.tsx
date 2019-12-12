import React from 'react'
import { useCommissionStore } from '@client/store/commission'
import { Grid, Row, Col, Placeholder, List, Icon, Message } from 'rsuite'
import { PanelContainer } from '@components/App/MainLayout'
import { t } from '@utility/lang'
import { ApprovalButtons } from './CommissionProcess'
import UserInfoCard from '@components/User/UserInfoCard'
import { CommissionCard } from '@components/Profile/ProfileCommission'
import { useUser } from '@hooks/user'
import { useMessageTextToHTML } from '@hooks/db'
import { get_profile_name, price_is_null } from '@utility/misc'
import PriceSuggestionForm from '@components/Form/PriceSuggestionForm'

const CommissionDescription = () => {
    const user = useUser()
    const store = useCommissionStore()

    let commission = store.get_commission()

    let is_owner = user._id === commission.from_user._id
    const current_user_id = is_owner ? commission.from_user._id : commission.to_user._id

    let descr_html = useMessageTextToHTML(commission.body)

    const custom_price = price_is_null(commission.rate.price)

    return (
        <Grid fluid>
            <Row>
                <Col xs={24}>
                    <UserInfoCard
                        notBodyFill
                        data={commission.from_user}
                        text={<span>{t`is requesting a commission from`} <span className="name">{get_profile_name(commission.to_user)}</span></span>}>
                        <CommissionCard
                            noCover
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
                        {!is_owner && (
                            <div>
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
                    {!!descr_html && <p dangerouslySetInnerHTML={{ __html: descr_html }} />}
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <h4 className="pb-1 mb-2">{t`Attachments`}</h4>
                    <PanelContainer bordered>
                        <List hover>
                            {commission.attachments.map(v => {
                                return (
                                    <a href={v.url} className="unstyled" key={v._id}>
                                    <List.Item>
                                        <div className="pl-2">
                                            <Icon icon="file" className="mr-2"/> {v.name}
                                        </div>
                                    </List.Item>
                                    </a>
                                )
                            })}
                        </List>
                    </PanelContainer>
                </Col>
            </Row>
        </Grid>
    )
}

export default CommissionDescription
