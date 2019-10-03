import React, { Component } from 'react';

import DashboardLayout from '@components/Dashboard/DashboardLayout'
import DashboardActivity from '@components/Dashboard/DashboardActivity';
import DashboardPage from '@components/App/DashboardPage';


class ActivityPage extends DashboardPage {
    render() {
        return this.renderPage(
            <DashboardLayout activeKey="activity">
                <DashboardActivity/>
            </DashboardLayout>
        );
    }
}

export default ActivityPage;