import React from 'react';

import MainLayout from '@components/App/MainLayout'
import DashboardLayout from '@components/Dashboard/DashboardLayout'
import FollowingsList from '@app/components/Dashboard/FollowingsList';

const FollowingsPage = () => {
    return (
        <DashboardLayout activeKey="followings">
            <FollowingsList/>
        </DashboardLayout>
    );
};

export default FollowingsPage;