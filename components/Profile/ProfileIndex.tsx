import React from 'react';

import { Col, Row, Grid } from 'rsuite'

import { CommissionCard, CommissionTiers } from '@app/components/Profile/ProfileCommission'

import { t } from '@app/utility/lang'
import Placeholder from '@components/App/Placeholder';
import { ReviewsReel } from '@components/Profile/ProfileReviews';

export const ProfileIndex = () => {
    return (
        <Grid fluid>
            <ReviewsReel/>
            <h3>{t`Commission Rates`}</h3>
            <CommissionTiers/>
            <h3>{t`About`}</h3>
            <p>
                <Placeholder type="text" rows={8}/>
            </p>
        </Grid>
    );
}

export default ProfileIndex;