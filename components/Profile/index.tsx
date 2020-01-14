import React, { useEffect, useState, useLayoutEffect } from 'react'
import Router from 'next/router'
import { Grid, Row, Col, Icon, IconButton, Panel, Button, Input, Modal, InputGroup } from 'rsuite'

import {
    MainLayout,
    Container,
    PanelContainer,
} from '@components/App/MainLayout'
import { ProfileHeader } from '@components/Profile/ProfileHeader'
import {
    ProfileMenu,
    Props as MenuProps,
} from '@components/Profile/ProfileMenu'
import ProfileInfo from '@components/Profile/ProfileInfo'
import { useProfileUser, useUser, useProfileContext } from '@hooks/user'
import { t } from '@app/utility/lang'
import { ReactProps } from '@utility/props'
import { useUpdateDatabase } from '@hooks/db'
import { follow_schema } from '@schema/user'
import { post_task, TaskMethods, post_task_debounce } from '@client/task'
import {
    TASK,
    Guideline,
    GuidelineType,
    guideline_types,
} from '@server/constants'
import { dashboard, make_profile_urlpath } from '@utility/pages'
import { get_profile_name } from '@utility/misc'
import useUserStore from '@store/user'
import * as pages from '@utility/pages'
import { CreatorHeadMeta } from '@components/App/Misc'

interface LayoutProps extends ReactProps, MenuProps {
    activeKey?: string
}

export const ProfileLayout = (props: LayoutProps) => {
    return (
        <MainLayout
            activeKey="profile"
            noContentMarginTop
            noContentPadded
            header={
                <>
                    <ProfileHeader></ProfileHeader>
                    <ProfileMenu {...props} />
                </>
            }>
            <CreatorHeadMeta/>
            <ProfileInfo className="float-right" />
            <PanelContainer fluid flex>
                {props.children}
            </PanelContainer>
        </MainLayout>
    )
}

export const ProfileNameTag = () => {
    const { profile_user, profile_owner } = useProfileContext()
    const store = useUserStore()
    const current_user = store.state.current_user

    const [edit, set_edit] = useState(false)
    const [can_edit, set_can_edit] = useState(false)

    useEffect(() => {
        if (profile_owner) {
            set_can_edit(true)
        } else if (!profile_user && current_user) {
            set_can_edit(true)
        }
    }, [profile_owner, profile_user, current_user])

    const profile_name = get_profile_name(
        can_edit ? current_user : profile_user
    )

    return (
        <>
            {!edit && !can_edit && (
                <h3 className="profile-name text-center">{profile_name}</h3>
            )}
            {!edit && can_edit && (
                <h3 className="profile-name text-center">
                    <Button
                        appearance="subtle"
                        className="!text-2xl !whitespace-normal"
                        onClick={ev => {
                            ev.preventDefault()
                            set_edit(true)
                        }}>
                        {profile_name}
                    </Button>
                </h3>
            )}
            {edit && (
                <h3 className="profile-name text-center pt-1">
                    <form
                        onSubmit={ev => {
                            ev.preventDefault()
                            const name = new FormData(ev.target as any).get(
                                'name'
                            )
                            if (name) {
                                store.update_user({ name })
                                set_edit(false)
                            }
                        }}>
                        <Input defaultValue={profile_name} name="name" />
                    </form>
                </h3>
            )}
        </>
    )
}

export const RequireOwnProfile = () => {
    const {
        context: { profile_path, profile_owner },
    } = useProfileUser()

    useLayoutEffect(() => {
        if (!profile_owner) {
            Router.replace(profile_path)
        }
    }, [profile_owner])

    return null
}

export const RequireCreator = () => {
    const user = useUser()

    useLayoutEffect(() => {
        if (user && user?.type !== 'creator') {
            Router.replace(dashboard)
        }
    }, [user])

    return null
}

export const RequireOwnProfileInverse = () => {
    const {
        context: { profile_path, profile_owner },
    } = useProfileUser()

    useLayoutEffect(() => {
        if (profile_owner) {
            Router.replace(profile_path)
        }
    }, [profile_owner])

    return null
}

interface ProfileButtonProps {
    current_user?: any
    profile_user?: any
    follow?: any
    size?: any
    className?: string
    appearance?: any
}

export const ShareButton = ({
    profile_user,
    size = 'lg',
    className = 'mx-2',
    appearance,
}: ProfileButtonProps) => {
    if (!profile_user) {
        const p = useProfileUser()
        profile_user = p.profile_user
    }

    const [show, set_show] = useState(false)
    const [url, set_url] = useState("")

    useEffect(() => {
        set_url(location.origin + make_profile_urlpath(profile_user))
    }, [profile_user])

    return (
        <>
        <Modal size="sm" show={show} onHide={() => { set_show(false)}}>
          <Modal.Header>
            <Modal.Title>{t`Share`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <p>
                  <InputGroup>
                    <InputGroup.Addon><Icon icon="globe" /></InputGroup.Addon>
                    <Input defaultValue={url} readOnly/>
                  </InputGroup>
              </p>
          </Modal.Body>
        </Modal>
        <IconButton
            icon={<Icon icon="share" />}
            appearance={appearance}
            size={size}
            className={className}
            onClick={ev => {
                ev.preventDefault()
                set_show(true)
            }}/>
        </>
    )
}

export const FollowButton = ({
    current_user,
    profile_user,
    follow,
    size = 'lg',
    className = 'mx-3',
}: ProfileButtonProps) => {
    if (!follow) {
        const p = useProfileUser()
        current_user = p.current_user
        profile_user = p.profile_user
        follow = p.context.follow
    }
    const [follow_obj, set_follow_obj] = useState(follow)
    const [loading, set_loading] = useState(false)
    const update = useUpdateDatabase()

    return (
        <IconButton
            loading={loading}
            icon={<Icon icon="bell" />}
            appearance="default"
            color={follow_obj ? 'blue' : undefined}
            size={size}
            className={className}
            onClick={ev => {
                ev.preventDefault()
                set_loading(true)
                if (!current_user) {
                    Router.push(pages.make_login_next_urlpath())
                    return
                }
                if (follow_obj) {
                    update(
                        'Follow',
                        { ...follow_obj, end: new Date() },
                        follow_schema,
                        true
                    ).then(r => {
                        if (r.status) {
                            set_follow_obj(null)
                        }
                        set_loading(false)
                    })
                } else {
                    update(
                        'Follow',
                        {
                            follower: current_user._id,
                            followee: profile_user._id,
                        },
                        follow_schema,
                        true,
                        true
                    ).then(r => {
                        if (r.status) {
                            set_follow_obj(r.body)
                            post_task(TaskMethods.schedule_unique, {
                                key: current_user._id,
                                when: '30 seconds',
                                task: TASK.followed_user,
                                data: {
                                    user_id: current_user._id,
                                    followee: profile_user._id,
                                },
                            })
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
    const { profile_user } = useProfileUser()

    const guidelines = profile_user?.commission_guidelines ?? []

    if (!guidelines.length) {
        return null
    }

    const titles = (v: Guideline) => {
        switch (v) {
            case GuidelineType.will_draw:
                return t`Will draw`
            case GuidelineType.will_not_draw:
                return t`Will not draw`
        }
    }

    const icons = (v: Guideline) => {
        switch (v) {
            case GuidelineType.will_draw:
                return { name: 'check', color: 'text-green-500' }
            case GuidelineType.will_not_draw:
                return { name: 'close', color: 'text-red-500' }
        }
    }

    return (
        <Panel bordered>
            <Grid fluid>
                <Row>
                    {guideline_types.map(gtype => (
                        <Col
                            key={gtype}
                            xs={Math.floor(24 / guideline_types.length)}>
                            <h4 className="text-center">{titles(gtype)}</h4>
                            <ul className="px-10">
                                {guidelines
                                    .filter(v => v.guideline_type === gtype)
                                    .map(({ guideline_type, value }, idx) => (
                                        <li className="flex justify-center content-center" key={idx.toString() + value}>
                                            <div className="py-2">
                                                <Icon
                                                    icon={
                                                        icons(guideline_type)
                                                            .name as any
                                                    }
                                                    className={`mr-2 ${
                                                        icons(guideline_type).color
                                                    }`}
                                                />
                                            </div>
                                            <div className="text-center border-b py-2">
                                            {value}
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </Col>
                    ))}
                </Row>
            </Grid>
        </Panel>
    )
}
