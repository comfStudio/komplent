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
import { get_profile_avatar_url, get_image_url } from '@utility/misc'
import { NewMessageButton } from '@components/Inbox/NewConvoModal'

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
            <Image className="cover-image" src={get_image_url(profile_user?.profile_cover, "big")} w={"1500px"} h={"500px"}/>
        </div>
    )
}

interface HeaderProps extends ReactProps {}

export const ProfileHeader = (props: HeaderProps) => {
    const {
        current_user,
        context: { profile_owner, commissions_open, profile_id },
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
                            {!!current_user &&
                            <NewMessageButton appearance="default" icon={<Icon icon="envelope-o"/>} size="lg" className="ml-3 mr-1" defaultValue={{reciepient: profile_id}}>
                                {t`Send Message`}
                            </NewMessageButton>}
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
