import React from 'react';
import { Grid, Row, Col, Uploader, Icon, Button, RadioGroup, Radio, DatePicker } from 'rsuite';

import { EditSection, EditGroup } from '@components/Settings';
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission';
import { useUser } from '@hooks/user';

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
            </EditSection>
        </Grid>
    );
};

export default CommissionOptions;