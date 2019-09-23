import React, { useEffect } from 'react';
import Router from 'next/router'

import { MainLayout, Container, PanelContainer } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import { ProfileMenu, Props as MenuProps } from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'
import { Grid, Row, Col, Icon } from 'rsuite';

interface LayoutProps extends ReactProps, MenuProps {
  activeKey?: string
}

export const ProfileLayout = (props: LayoutProps) => {
    return (
        <MainLayout activeKey="profile">
          <ProfileHeader></ProfileHeader>
        <ProfileMenu {... props}/>
        <Container>
          <ProfileInfo className="float-right"/>
          <PanelContainer bordered fluid flex>
            { props.children }
          </PanelContainer>
        </Container>
      </MainLayout>
    )
}

interface ProfileNameTagProps {
  name: string
}

export const ProfileNameTag = (props: ProfileNameTagProps) => {
  return (<h3 className="profile-name text-center">{props.name}</h3>)
}

export const RequireOwnProfile = () => {
  const { context : { profile_path, profile_owner } } = useProfileUser()

  useEffect(() => {
    if (!profile_owner) {
      Router.replace(profile_path)
    }
  }, [profile_owner])

  return null
}

export const RequireOwnProfileInverse = () => {
  const { context : { profile_path, profile_owner } } = useProfileUser()

  useEffect(() => {
    if (profile_owner) {
      Router.replace(profile_path)
    }
  }, [profile_owner])

  return null
}

export const DrawingList = () => {
  return (
    <Grid fluid>
      <Row>
        <Col xs={12}>
          <h4 className="text-center">{t`Will draw`}</h4>
          <ul>
            <li><Icon icon="check" className="mr-2 text-green-500" />Mech</li>
            <li><Icon icon="check" className="mr-2 text-green-500" />OCs and ships</li>
            <li><Icon icon="check" className="mr-2 text-green-500" />Humanoids</li>
            <li><Icon icon="check" className="mr-2 text-green-500" />Minor gore</li>
            <li><Icon icon="check" className="mr-2 text-green-500" />Minor NSFW</li>
            <li><Icon icon="check" className="mr-2 text-green-500" />Backgrounds</li>
          </ul>
        </Col>
        <Col xs={12}>
          <h4 className="text-center">{t`Will not draw`}</h4>
          <ul>
            <li><Icon icon="close" className="mr-2 text-red-500"/>Full furries</li>
            <li><Icon icon="close" className="mr-2 text-red-500"/>Hardcore gore</li>
            <li><Icon icon="close" className="mr-2 text-red-500"/>Hardcore NSFW</li>
            <li><Icon icon="close" className="mr-2 text-red-500"/>LGBT</li>
          </ul>
        </Col>
      </Row>
    </Grid>
  )
}