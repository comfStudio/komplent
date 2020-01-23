import React, { useCallback, memo } from 'react'
import {
    Grid,
    Row,
    Col,
    Uploader,
    Icon,
    Button,
    RadioGroup,
    Radio,
    DatePicker,
    InputNumber,
} from 'rsuite'

import { EditSection, EditGroup } from '@components/Settings'
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission'
import { CommissionProcess } from '@components/Settings/CommissionsSettings'
import debounce from 'lodash/debounce'
import { useDebounce } from 'react-use'

const Deadline = memo(function Deadline() {
    const store = useCommissionStore()
    const commission = store.get_commission()

    const update = useCallback(
        debounce((v: number, ev) => {
            store.update({ commission_deadline: v })
        }, 400),
        []
    )

    return (
        <EditGroup>
            <span className="mr-2">{t`Deadline`}: </span>
            <div className="w-32">
                <InputNumber
                    defaultValue={commission.commission_deadline}
                    postfix={t`days`}
                    onChange={update}
                />
            </div>
        </EditGroup>
    )
})

const CommissionOptions = memo(function CommissionOptions() {
    return (
        <Grid fluid>
            <h4>{t`General`}</h4>
            <EditSection>
                <Deadline />
            </EditSection>
            <h4>{t`Process`}</h4>
            <EditSection>
                <CommissionProcess commission />
            </EditSection>
        </Grid>
    )
})

export default CommissionOptions
