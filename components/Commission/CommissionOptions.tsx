import React from 'react';
import { Grid, Row, Col, Uploader, Icon, Button, RadioGroup, Radio, DatePicker } from 'rsuite';

import { EditSection, EditGroup } from '@components/Settings';
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission';
import { useUser } from '@hooks/user';

const PaymentPosition = () => {

    const store = useCommissionStore()
    let commission = store.get_commission()

    return (
        <EditGroup>
            <span className="mr-2">{t`When would you like to receive payment?`}: </span>
            <RadioGroup name="payment_position" inline appearance="picker" defaultValue={commission.payment_position||"first"} onChange={async (v) => {
                store.update({payment_position: v})
                }}>
            <Radio disabled={commission.payment} value="first">{t`before`}</Radio>
            <Radio disabled={commission.payment} value="last">{t`after`}</Radio>
            </RadioGroup>
        </EditGroup>
    )
}

const Deadline = () => {

    const store = useCommissionStore()
    let commission = store.get_commission()

    return (
        <EditGroup>
            <span className="mr-2">{t`Deadline`}: </span>
            <DatePicker className="w-64"/>
        </EditGroup>
    )
}


const CommissionOptions = () => {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <Deadline/>
            </EditSection>
            <h4>{t`Payment`}</h4>
            <EditSection>
                <PaymentPosition/>
            </EditSection>
        </Grid>
    );
};

export default CommissionOptions;