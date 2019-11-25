import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout } from '@components/Profile'
import ProfileGallery from '@components/Profile/ProfileGallery'

class GalleryPage extends ProfilePage {
    public render() {
        return this.renderPage(
            <ProfileLayout activeKey="gallery">
                <ProfileGallery fluid />
            </ProfileLayout>
        )
    }
}

export default GalleryPage
