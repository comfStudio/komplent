import React from 'react';

import CommissionsPage from '@components/App/CommissionsPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'
import { RequestListing } from '@components/Commissions/CommissionsListing';

class RequestsPage extends CommissionsPage {
    render() {
        return this.renderPage(
        <CommissionsLayout activeKey="requests">
            <RequestListing/>
        </CommissionsLayout>
        );
    }
}

export default RequestsPage;