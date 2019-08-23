import React, { Component } from 'react';

import { Col, Row, Grid } from 'rsuite'

import { CommissionCard, CommissionTiers } from '@app/components/Profile/ProfileCommission'

import { t } from '@app/utility/lang'

export class ProfileIndex extends Component {
    render() {
        return (
            <Grid fluid>
                <h3>{t`Commission Rates`}</h3>
                <CommissionTiers/>
            </Grid>
        );
    }
}

export default ProfileIndex;