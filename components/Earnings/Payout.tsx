import React, { useState } from 'react';
import { Panel, Button, Message } from "rsuite"
import { t } from '@app/utility/lang'
import { usePayoutStore } from '@store/earnings';
import { decimal128ToMoneyToString, decimal128ToFloat } from '@utility/misc';
import { format } from 'date-fns';
import { OK } from 'http-status-codes';
import { useUser } from '@hooks/user';
import { minimumPayoutBalance } from '@server/constants';

export const PayoutBalance = () => {

    const user = useUser()
    const store = usePayoutStore()
    const [ loading, set_loading ] = useState(false)
    const [ error, set_error ] = useState()

    const from_date = store.state.balance?.from_date ? new Date(store.state.balance.from_date) : new Date()
    const to_date = store.state.balance?.to_date ? new Date(store.state.balance.to_date) : new Date()

    const payout_created = store.state.pending_payout?.created ? new Date(store.state.pending_payout.created) : new Date()
    const payout_date = payout_created ? format(payout_created, 'dd MMM yyyy') : ""

    return (
        <Panel bordered header={<h3>{t`Balance`} <span className="muted">({format(from_date, 'dd MMM')} - {format(to_date, 'dd MMM')})</span></h3>}>
            {!!store.state.pending_payout &&
            <Message type="info" description={t`A payout is currently in the process since ${payout_date}`}/>
            }
            {!!!store.state.pending_payout &&
            <>
            <p>
                <span className="text-primary text-4xl">
                    {decimal128ToMoneyToString(store.state.balance?.total_balance)} <span className="muted text-xl">({decimal128ToMoneyToString(store.state.balance?.fees_price)} fees)</span>
                </span>
            </p>
            <p>
                <Button appearance="primary" loading={loading} disabled={decimal128ToFloat(store.state.balance?.total_balance) < minimumPayoutBalance} onClick={e => {
                    e.preventDefault()
                    set_loading(true)
                    set_error(null)
                    store.create_payout().then(async r => {
                        set_loading(false)
                        if (r.status === OK && (await r.json()).data) {
                            store.setState({
                                pending_payout: await store.load_pending_payout(user),
                                ...await store.load(user)
                            })
                        }
                    })
                }}>
                    {t`Widthdraw`}
                </Button>
            </p>
            </>
            }
            {error && <Message className="mt-2" type="error" description={t`An error occured, please contact the staff`}/>}
        </Panel>
    )
}