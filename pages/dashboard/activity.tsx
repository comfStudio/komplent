import React, { Component } from 'react';

import AuthPage from '@components/App/AuthPage'
import DashboardLayout from '@components/Dashboard/DashboardLayout'
import DashboardActivity from '@app/components/Dashboard/DashboardActivity';


class ActivityPage extends AuthPage {
    render() {
        return this.renderPage(
            <DashboardLayout activeKey="activity">
                <DashboardActivity/>
            </DashboardLayout>
        );
    }
}

export default ActivityPage;