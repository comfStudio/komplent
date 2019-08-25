import React, { Component } from 'react';

import { Col, Row, Grid } from 'rsuite'

import { CommissionCard, CommissionTiers } from '@app/components/Profile/ProfileCommission'

import { t } from '@app/utility/lang'
import Placeholder from '../App/Placeholder';

export class ProfileIndex extends Component {
    render() {
        return (
            <Grid fluid>
                <h3>{t`Commission Rates`}</h3>
                <CommissionTiers/>
                <h3>{t`About`}</h3>
                <p>
                    <Placeholder type="text" rows={8}/>
                </p>
            </Grid>
        );
    }
}

export default ProfileIndex;