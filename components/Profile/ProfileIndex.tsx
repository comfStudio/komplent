import React from 'react';

import { Col, Row, Grid, Message } from 'rsuite'

import { CommissionCard, CommissionTiers } from '@app/components/Profile/ProfileCommission'
import { DrawingList } from '@app/components/Profile'

import { t } from '@app/utility/lang'
import Placeholder from '@components/App/Placeholder';
import { ReviewsReel } from '@components/Profile/ProfileReviews';

export const ProfileIndex = () => {
    return (
        <Grid fluid>
            <Message type="info" description={
                <p>
                    Hello lovely people!
                    {<br/>}
                    I just want to inform you that I will be closing up commissions until further notice!
                    {<br/>}
                    Thank you everyone for participating this time around &lt;3!
                </p>
            }/>
            <ReviewsReel/>
            <h3>{t`Commission Rates`}</h3>
            <CommissionTiers/>
            <hr/>
            <DrawingList/>
            <h3>{t`About`}</h3>
            <p>
                <Placeholder type="text" rows={8}/>
            </p>
        </Grid>
    );
}

export default ProfileIndex;