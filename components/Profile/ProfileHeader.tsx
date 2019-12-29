import './ProfileHeader.scss'
import React, { useRef, useState } from 'react'
import { IconButton, Icon } from 'rsuite'

import { Container } from '@components/App/MainLayout'
import { ReactProps } from '@utility/props'
import { useProfileUser, useUser } from '@hooks/user'
import { t } from '@app/utility/lang'
import { FollowButton, ShareButton } from '.'
import CommissionButton from '@components/Commission/CommissionButton'
import { useHoverDirty } from 'react-use'
import Upload from '@components/App/Upload'
import { FileType } from 'rsuite/lib/Uploader'
import useUserStore from '@store/user'
import Image from '@components/App/Image'
import { get_profile_avatar_url } from '@utility/misc'

interface HoverImageUploadProps {
    children: any
    elementRef: any
    enabled?: boolean
    onUpload: (response, file: FileType) => void
}


export const Avatar = props => {

    const {
        profile_user,
    } = useProfileUser()

    const user = useUser()

    return (
        <div className="avatar">
            <Image className="avatar-image w-full h-full" src={get_profile_avatar_url(profile_user || user)} w={"250px"} h={"250px"}/>
        </div>
    )
}

export const Cover = props => {

    const {
        profile_user,
    } = useProfileUser()

    return (
        <div className="cover">
            <Image className="cover-image" src={profile_user?.profile_cover?.paths?.[0]?.url} w={"1500px"} h={"500px"}/>
        </div>
    )
}

interface HeaderProps extends ReactProps {}

export const ProfileHeader = (props: HeaderProps) => {
    const {
        context: { profile_owner, commissions_open },
    } = useProfileUser()

    return (
        <div id="profile-header">
            <div className="gradient"></div>
            <Container>
                <Cover />
                <Avatar />
                <div id="header-container">
                    {!profile_owner && (
                        <React.Fragment>
                            <CommissionButton className="z-10" />
                            <FollowButton />
                            <ShareButton/>
                        </React.Fragment>
                    )}
                    {props.children}
                </div>
            </Container>
        </div>
    )
}

export default ProfileHeader
