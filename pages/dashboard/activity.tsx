import React from 'react';

import MainLayout from '@components/App/MainLayout'
import DashboardLayout from '@components/Dashboard/DashboardLayout'
import DashboardActivity from '@app/components/Dashboard/DashboardActivity';

const ActivityPage = () => {
    return (
        <DashboardLayout activeKey="activity">
            <DashboardActivity/>
        </DashboardLayout>
    );
};

export default ActivityPage;