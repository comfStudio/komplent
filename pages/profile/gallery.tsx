import React from 'react'

import { ProfileLayout } from '@components/Profile'
import ProfileGallery from '@app/components/Profile/ProfileGallery';

export const GalleryPage = (props) => {

    return (
        <ProfileLayout activeKey="gallery">
            <ProfileGallery fluid/>
        </ProfileLayout>
    )
}

export default GalleryPage
