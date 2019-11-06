import React from 'react';
import { Grid, Row, Col, Uploader, Icon, Button, RadioGroup, Radio, DatePicker, InputNumber } from 'rsuite';

import { EditSection, EditGroup } from '@components/Settings';
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission';
import { CommissionProcess } from '@components/Settings/CommissionsSettings';

const Deadline = () => {

    const store = useCommissionStore()

    return (
        <EditGroup>
            <span className="mr-2">{t`Deadline`}: </span>
            <div className="w-32">
                <InputNumber defaultValue="14" postfix={t`days`}/>
            </div>
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
            <h4>{t`Process`}</h4>
            <EditSection>
                <CommissionProcess commission/>
            </EditSection>
        </Grid>
    );
};

export default CommissionOptions;