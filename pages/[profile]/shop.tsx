import React from 'react'

import ProfilePage from '@components/App/ProfilePage'
import { ProfileLayout } from '@components/Profile'

class ShopPage extends ProfilePage {
    public render() {
        return this.renderPage(<ProfileLayout activeKey="shop"></ProfileLayout>)
    }
}

export default ShopPage
