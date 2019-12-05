import React, { useState } from 'react';
import { Panel, Button } from "rsuite"
import { t } from '@app/utility/lang'
import { usePayoutStore } from '@store/earnings';
import { decimal128ToMoneyToString } from '@utility/misc';
import { format } from 'date-fns';

export const PayoutBalance = () => {

    const store = usePayoutStore()

    const from_date = store.state.balance?.from_date ? new Date(store.state.balance.from_date) : new Date()
    const to_date = store.state.balance?.to_date ? new Date(store.state.balance.to_date) : new Date()

    return (
        <Panel bordered header={<h3>{t`Balance`} <span className="muted">({format(from_date, 'dd MMM')} - {format(to_date, 'dd MMM')})</span></h3>}>
            <p>
                <span className="text-primary text-4xl">
                    {decimal128ToMoneyToString(store.state.balance?.total_balance)} <span className="muted text-xl">({decimal128ToMoneyToString(store.state.balance?.fees_price)} fees)</span>
                </span>
            </p>
            <p>
                <Button appearance="primary">
                    {t`Widthdraw`}
                </Button>
            </p>
        </Panel>
    )
}