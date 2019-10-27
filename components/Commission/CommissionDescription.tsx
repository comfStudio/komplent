import React from 'react';
import { useCommissionStore } from '@client/store/commission';
import { Grid, Row, Col } from 'rsuite';
import { PanelContainer } from '@components/App/MainLayout';
import { t } from '@utility/lang'
import { ApprovalButtons } from './CommissionProcess';
import UserInfoCard from '@components/User/UserInfoCard';
import { CommissionCard } from '@components/Profile/ProfileCommission';
import { useUser } from '@hooks/user';

const CommissionDescription = () => {
    const user = useUser()
    const store = useCommissionStore()

    let commission = store.get_commission()

    let is_owner = user._id === commission.from_user._id

    return (
        <Grid fluid>
             <Row>
                <Col xs={24}>
                    <UserInfoCard notBodyFill data={commission.from_user} text={t`is requesting a commission`}>
                        <CommissionCard noCover data={commission.rate} extras={commission.extras}/>
                        {!is_owner &&
                        <div className="text-center">
                            <hr/>
                            {!commission.accepted &&
                            <>
                            <p>{t`Waiting for your approval.`}</p>
                            <p>
                                <ApprovalButtons/>
                            </p>
                            </>
                            }
                            {commission.accepted &&
                            <p>{t`You approved of this request.`}</p>
                            }
                        </div>
                        }
                    </UserInfoCard>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <h4 className="pb-1 mb-2">{t`Information`}</h4>
                    <p>
                        {commission.body}
                    </p>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <h4 className="pb-1 mb-2">{t`Attachments`}</h4>
                    <PanelContainer bordered>

                    </PanelContainer>
                </Col>
            </Row>
        </Grid>
    );
};

export default CommissionDescription;