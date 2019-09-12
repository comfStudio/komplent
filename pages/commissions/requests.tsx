import React from 'react';

import AuthPage from '@components/App/AuthPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'

class RequestsPage extends AuthPage {
    render() {
        return this.renderPage(
        <CommissionsLayout activeKey="requests">
        </CommissionsLayout>
        );
    }
}

export default RequestsPage;