import React from 'react';

import CommissionPage from '@components/App/CommissionPage'
import CommissionLayout from '@components/Commission/CommissionLayout';
import CommissionProcess from '@components/Commission/CommissionProcess';
import CommissionDescription from '@components/Commission/CommissionDescription';

class Page extends CommissionPage {
    render() {

        let c = this.props.commissionStoreState.commission
        let accepted = c ? c.accepted : false

        return this.renderPage(
        <CommissionLayout activeKey={accepted ? "timeline" : "description"}>
            {accepted && <CommissionProcess/>}
            {!accepted && <CommissionDescription/>}
        </CommissionLayout>
        );
    }
}

export default Page;