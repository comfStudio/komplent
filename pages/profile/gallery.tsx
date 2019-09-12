import React from 'react'

import AuthPage from '@components/App/AuthPage'
import { ProfileLayout } from '@components/Profile'
import ProfileGallery from '@app/components/Profile/ProfileGallery';

class GalleryPage extends AuthPage {
    public render() {
      return this.renderPage(
        <ProfileLayout activeKey="gallery">
            <ProfileGallery fluid/>
        </ProfileLayout>
      )
    }
  }

export default GalleryPage
