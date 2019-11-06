import React, { useState, useEffect, useRef } from 'react';
import { useSessionStorage, useMountedState } from 'react-use';
import { InputNumber, List, Grid, Button, DatePicker, Icon, Message } from 'rsuite';

import { EditGroup, EditSection } from '.';
import { t } from '@app/utility/lang'
import CommissionRateForm, { RateOptionsForm } from '@components/Form/CommissionRateForm';
import { CommissionTiersRow } from '@components/Profile/ProfileCommission';
import Placeholder from '@components/App/Placeholder';
import TextEditor from '@components/App/TextEditor';
import { useCommissionStore } from '@store/commission';
import { CommissionPhaseType, CommissionPhaseT } from '@server/constants';
import useUserStore from '@store/user';
import debounce from 'lodash/debounce';
import { CommissionProcessType } from '@schema/user';

export const CommissionLimit = () => {
    return (
    <EditGroup title={t`Maximum amount of on-going commissions` + ':'}>
        <div className="w-32">
            <InputNumber defaultValue="3"/>
        </div>
    </EditGroup>
    )
}

export const CommissionRequestLimit = () => {
    return (
    <EditGroup title={t`Maximum amount of on-going requests` + ':'}>
        <div className="w-32">
            <InputNumber defaultValue="10"/>
        </div>
    </EditGroup>
    )
}

export const CommissionGuideline = () => {

    return (
        <React.Fragment>
            <EditGroup title={t`Will draw`}>
                <EditSection>
                <List className="w-64">
                <List.Item key="">OCs</List.Item>
                </List>
                </EditSection>
            </EditGroup>
            <EditGroup title={t`Will not draw`}>
                <EditSection>
                <List className="w-64">
                <List.Item key="">NSFW</List.Item>
                </List>
                </EditSection>
            </EditGroup>
        </React.Fragment>
    )
}

interface CommissionProcessProps {
    commission?: boolean
}

export const CommissionProcess = (props: CommissionProcessProps) => {
    let accepted = false
    let def_stages: CommissionProcessType[], user, comm_store, user_store

    if (props.commission) {
        comm_store = useCommissionStore()
        accepted = comm_store.get_commission().accepted
        def_stages = comm_store.get_commission().commission_process
    } else {
        user_store = useUserStore()
        user = user_store.state.current_user
        def_stages = user.commission_process
    }
    const [stages, set_stages] = useState(def_stages)
    const prev_stages = useRef(stages)

    const get_name = (v: CommissionPhaseType) => {
        switch (v) {
            case 'pending_approval':
                return t`Approval`
            case 'pending_sketch':
                return t`Initial Sketch`
            case 'pending_payment':
                return t`Request Payment`
            case 'pending_product':
                return t`Commission Product`
            case 'revision':
                    return t`Allow Revision`
            case 'complete':
                return t`Commission Complete`
            case 'unlock':
                return t`Unlock Product Access`
        }
    }

    const collections = useCommissionStore.actions.get_stages_collections()

    const mounted = useMountedState()

    const update = debounce((data) => {
        data = useCommissionStore.actions.process_stages(data)
        if (!(data.length === prev_stages.current.length && data.every((v, i) => prev_stages[i]?.type === v.type))) {
            prev_stages.current = data
            if (props.commission) {
                comm_store.update({commission_process: data})
            } else {
                user_store.update_user({commission_process: data})
            }
        }
    }, 500)

    useEffect(() => {
        if (mounted) {
            update(stages)
        }
    }, [stages])

    const handleSortEnd = ({oldIndex, newIndex}) => {
        const move_data = stages.splice(oldIndex,1);
        const new_data = [...stages];
        new_data.splice(newIndex, 0, move_data[0]);
        set_stages(useCommissionStore.actions.process_stages(new_data))
    };

    const stages_limit = useCommissionStore.actions.get_stages_limits()

    const addable_stages: CommissionPhaseType[] = [
        CommissionPhaseT.pending_payment,
        CommissionPhaseT.pending_product,
        CommissionPhaseT.pending_sketch,
        CommissionPhaseT.revision,
    ]


    return (
        <EditGroup>
            {accepted &&
            <Message className="mb-2" type="warning" description={t`The commission process cannot be changed once the commission has been accepted`}/>
            }
            <List className="">
                <List.Item>
                    {addable_stages.map(v => <span className="mr-1" key={v}>
                        <Button disabled={accepted || stages.filter(i => i.type === v).length >= stages_limit[v]} onClick={() => {set_stages(useCommissionStore.actions.process_stages([...stages, {type: v, done: false}]))}}>
                            <Icon className="mr-1" icon="plus"/>{get_name(v)}
                        </Button>
                        </span>)}
                </List.Item>
            </List>
            <List className="w-64" sortable onSort={handleSortEnd}>
                {stages.map((v, idx) =>
                <List.Item index={idx} collection={collections[v.type]} disabled={accepted || (['complete', 'pending_approval', 'unlock'] as CommissionPhaseType[]).includes(v.type)} key={v.type + idx.toString()}>
                    {addable_stages.includes(v.type) &&
                    <a href="#" onClick={(ev) => {ev.preventDefault(); let s = stages.slice(); s.splice(idx,1); set_stages(s)}}><Icon className="mr-2" icon="minus-circle" /></a>
                    }
                    {get_name(v.type)}
                </List.Item>)}
            </List>
        </EditGroup>
    )
}

export const Rates = () => {

    const [ show_new_rate, set_show_new_rate ] = useSessionStorage("new-commission-rate-form-show", false)

    return (
        <React.Fragment>
            {!show_new_rate && <Button onClick={(ev) => {ev.preventDefault(); set_show_new_rate(true);}}>{t`Add new rate`}</Button>}
            {show_new_rate && <EditGroup>
                            <CommissionRateForm panel onDone={() => {set_show_new_rate(false);}}/>
                        </EditGroup>}
            <EditGroup>
                <Grid fluid>
                    <CommissionTiersRow/>
                </Grid>
            </EditGroup>
        </React.Fragment>
    )
}

export const CommissionMessage = () => {
    return (
        <EditGroup>
            <TextEditor/>
        </EditGroup>
    )
}

export const CommissionAcceptMessage = () => {
    return (
        <EditGroup>
            <Placeholder type="text" rows={5}/>
        </EditGroup>
    )
}

const CommissionsSettings = () => {
    return (
        <Grid fluid>
            
            <h4>{t`Rates`}</h4>
            <EditSection>
                <Rates/>
            </EditSection>

            <h4>{t`Extras`}</h4>
            <EditSection>
                <EditGroup>
                    <RateOptionsForm/>
                </EditGroup>
            </EditSection>

            <h4>{t`Process`}</h4>
            <EditSection>
                <CommissionProcess/>
            </EditSection>

            <h4>{t`Limits`}</h4>
            <EditSection>
                <CommissionLimit/>
                <CommissionRequestLimit/>
            </EditSection>

            <h4>{t`Guidelines`}</h4>
            <EditSection>
                <EditGroup>
                    <CommissionGuideline/>
                </EditGroup>
            </EditSection>
            
            <h4>{t`Message`}</h4>
            <EditSection>
                <CommissionMessage/>
            </EditSection>

            <h4>{t`Request Accept Message`}</h4>
            <EditSection>
                <CommissionAcceptMessage/>
            </EditSection>
        </Grid>
    );
};

export default CommissionsSettings;