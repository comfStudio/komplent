import React from 'react';

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout';
import CommissionProcess from '@components/Commission/CommissionProcess';

class Page extends CommissionPage {
    render() {
        return this.renderPage(
        <CommissionLayout activeKey="description">
        </CommissionLayout>
        );
    }
}

export default Page;