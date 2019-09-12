import React from 'react';

import AuthPage from '@components/App/AuthPage'
import CommissionsLayout from '@components/Commissions/CommissionsLayout'

class CommissionsPage extends AuthPage {
    render() {
        return this.renderPage(
        <CommissionsLayout activeKey="commissions">
        </CommissionsLayout>
        );
    }
}

export default CommissionsPage;