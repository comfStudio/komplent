import React from 'react';
import { useFollowerStore } from '@store/user';
import { Grid, Row, Col, List, PanelGroup } from 'rsuite';
import Link from 'next/link';
import { make_profile_urlpath } from '@utility/pages';
import { PanelContainer } from '@components/App/MainLayout';
import { t } from '@app/utility/lang'

const FollowingsList = () => {

    const store = useFollowerStore()

    return (
        <PanelContainer bordered bodyFill header={(<h5 className="inline-block w-full">{t`Followings`}</h5>)}>
            <PanelGroup>
            <List bordered hover>
                {store.state.followers.map((user) => {

                    return (
                        <Link href={make_profile_urlpath(user)} key={user._id}>
                            <a className="unstyled">
                            <List.Item componentClass="a">{user.username}</List.Item>
                            </a>
                        </Link>
                    ) 
                })}
            </List>
            </PanelGroup>
        </PanelContainer>
        );
};

export default FollowingsList;