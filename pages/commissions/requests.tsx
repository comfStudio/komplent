import React from 'react';

import CommissionsPage from '@components/App/CommissionsPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'

class RequestsPage extends CommissionsPage {
    render() {
        return this.renderPage(
        <CommissionsLayout activeKey="requests">
        </CommissionsLayout>
        );
    }
}

export default RequestsPage;