import React from 'react';

import { Col, Row, Grid, Message } from 'rsuite'

import { CommissionCard, CommissionTiersRow } from '@app/components/Profile/ProfileCommission'
import { GuidelineList } from '@app/components/Profile'

import { t } from '@app/utility/lang'
import Placeholder from '@components/App/Placeholder';
import { ReviewsReel } from '@components/Profile/ProfileReviews';
import { useProfileUser } from '@hooks/user';

export const ProfileIndex = () => {

    const { profile_user } = useProfileUser()

    return (
        <Grid fluid>
            {profile_user.settings.notice_visible && profile_user.notice &&
            <Message type="info" description={profile_user.notice}/>
            }
            <ReviewsReel/>
            <h3>{t`Commission Rates`}</h3>
            <CommissionTiersRow/>
            <hr/>
            <GuidelineList/>
            <h3>{t`About`}</h3>
            <p>
                <Placeholder type="text" rows={8}/>
            </p>
        </Grid>
    );
}

export default ProfileIndex;