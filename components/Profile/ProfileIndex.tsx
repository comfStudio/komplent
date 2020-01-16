import React from 'react'

import { Col, Row, Grid, Message, Placeholder } from 'rsuite'

import {
    CommissionCard,
    CommissionTiersRow,
} from '@app/components/Profile/ProfileCommission'
import { GuidelineList } from '@app/components/Profile'

import { t } from '@app/utility/lang'
import { ReviewsReel } from '@components/Profile/ProfileReviews'
import { useProfileUser } from '@hooks/user'
import { useDatabaseTextToHTML } from '@hooks/db'
import UserHTMLText from '@components/App/UserHTMLText'

export const ProfileIndex = () => {
    const {
        profile_user,
        context: { commissions_open, profile_owner },
    } = useProfileUser()
    const about_html = useDatabaseTextToHTML(profile_user?.about)

    return (
        <Grid fluid>
            {profile_user.notice_visible && profile_user.notice && (
                <Message type="info" description={profile_user.notice} />
            )}
            <h3>{t`Commission Rates`}</h3>
            <CommissionTiersRow settingsPlaceholder link={commissions_open && !profile_owner} />
            <hr />
            <GuidelineList />
            <h3>{t`About`}</h3>
            {!!!about_html && <Placeholder.Paragraph rows={8} />}
            {!!about_html && <UserHTMLText html={about_html}/>}
        </Grid>
    )
}

export default ProfileIndex
