import React from 'react';

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout';

class Page extends CommissionPage {
    render() {
        return this.renderPage(
        <CommissionLayout activeKey="inbox">
        </CommissionLayout>
        );
    }
}

export default Page;