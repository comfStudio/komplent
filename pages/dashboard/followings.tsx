import React from 'react';

import AuthPage from '@components/App/AuthPage'
import DashboardLayout from '@components/Dashboard/DashboardLayout'
import FollowingsList from '@app/components/Dashboard/FollowingsList';

class FollowingsPage extends AuthPage {
    render() {
        return this.renderPage(
            <DashboardLayout activeKey="followings">
            <FollowingsList/>
        </DashboardLayout>
        );
    }
}

export default FollowingsPage;