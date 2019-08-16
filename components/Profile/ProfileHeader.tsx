import './ProfileHeader.css'
import React, { Component } from 'react';

import { Container } from '@components/App/MainLayout'
import { ReactProps } from '@utility/props'
import { CommissionButton } from '@components/Profile'

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

export class ProfileHeader extends Component<HeaderProps> {
    render() {
        return (
            <div id="profile-header">
                <div className="gradient"></div>
                <Container>
                    <Cover/>
                    <Avatar/>
                    <div id="header-container">
                        <CommissionButton className="z-10"/>
                        {this.props.children}
                    </div>
                </Container>
            </div>
        );
    }
}

export default ProfileHeader