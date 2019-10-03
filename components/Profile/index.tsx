import React, { useEffect, useState } from 'react';
import Router from 'next/router'
import { Grid, Row, Col, Icon, IconButton } from 'rsuite';

import { MainLayout, Container, PanelContainer } from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import { ProfileMenu, Props as MenuProps } from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'
import { useUpdateDatabase } from '@hooks/db';
import { follow_schema } from '@schema/user'

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

export const FollowButton = () => {

  const { current_user, profile_user, context: { follow } } = useProfileUser()
  const [follow_obj, set_follow_obj] = useState(follow)
  const [loading, set_loading] = useState(false)
  const update = useUpdateDatabase()

  return (
      <IconButton loading={loading} icon={<Icon icon="bell"/>} appearance="default" color={follow_obj ? "blue" : undefined} size="lg" className="mx-3"
      onClick={(ev) => {
        ev.preventDefault()
        set_loading(true)
        if (follow_obj) {
          update("Follow", {...follow_obj, end: new Date()}, follow_schema, true).then((r) => {
            if (r.status) {
              set_follow_obj(null)
            }
            set_loading(false)
          })
        } else {
          update("Follow", {follower: current_user._id, followee: profile_user._id}, follow_schema, true, true).then((r) => {
            if (r.status) {
              set_follow_obj(r.body)
            }
            set_loading(false)
          })
        }
      }}>
      {follow_obj ? t`Following` : t`Follow`}
      </IconButton>
  )
}

export const GuidelineList = () => {
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