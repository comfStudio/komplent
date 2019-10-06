import './ProfileHeader.scss'
import React from 'react';
import { IconButton, Icon } from 'rsuite'

import { Container } from '@components/App/MainLayout'
import { ReactProps } from '@utility/props'
import { CommissionButton } from '@app/components/Profile/ProfileCommission'
import { useProfileUser } from '@hooks/user'
import { t } from '@app/utility/lang'
import { FollowButton } from '.';

export const Avatar = (props) => {
    return (
        <div className="avatar border-r-4 border-l-4 border-t-4 border-white">
            <img src="https://pbs.twimg.com/profile_images/1020783894042488832/lm0a9IeQ_400x400.jpg" />
        </div>
    )
}

export const Cover = (props) => {
    return (
        <div className="cover">
            <img src="https://pbs.twimg.com/profile_banners/1003433765148987392/1532208395/1500x500" />
        </div>
    )
}

interface HeaderProps extends ReactProps {

} 

export const ProfileHeader = (props: HeaderProps) => {

    const { context: { profile_owner, commissions_open } } = useProfileUser()

    return (
        <div id="profile-header">
            <div className="gradient"></div>
            <Container>
                <Cover/>
                <Avatar/>
                <div id="header-container">
                    { !profile_owner && (
                        <React.Fragment>
                            {commissions_open && <CommissionButton className="z-10"/>}
                            <FollowButton/>
                        </React.Fragment>
                    )}
                    {props.children}
                </div>
            </Container>
        </div>
    );
}

export default ProfileHeader