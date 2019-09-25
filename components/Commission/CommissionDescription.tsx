import React from 'react';
import { useCommissionStore } from '@store/commission';
import { Grid, Row, Col } from 'rsuite';
import { PanelContainer } from '@components/App/MainLayout';
import { t } from '@utility/lang'

const CommissionDescription = () => {

    const [state, actions] = useCommissionStore()

    let commission = actions.get_commission()

    return (
        <Grid fluid>
            <Row>
                <Col xs={24}>
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