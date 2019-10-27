import React from 'react';
import { Panel, Grid, Row, Col } from 'rsuite';
import { Avatar } from '@components/Profile/ProfileHeader';
import './UserInfoCard.scss'
import { get_profile_name } from '@utility/misc';
import { ReactProps } from '@utility/props';

interface UserInfoCardProps extends ReactProps {
    data: any
    text?: string
    notBordered?: boolean
    notBodyFill?: boolean
}

const UserInfoCard = (props: UserInfoCardProps) => {
    return (
        <Panel bordered={!props.notBordered} bodyFill={!props.notBodyFill} className="user-info-panel">
            <div className="avatar-container">
                <Avatar/>
            </div>
            <div className="info">
                <h4><span className="name">{get_profile_name(props.data)}</span> {props.text}</h4>
            </div>
            <div className="body">
                {props.children}
            </div>
        </Panel>
    );
};

export default UserInfoCard;