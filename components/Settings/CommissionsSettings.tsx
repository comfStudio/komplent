import React, { useState, useEffect } from 'react';
import { useSessionStorage, useMountedState } from 'react-use';
import { InputNumber, List, Grid, Button } from 'rsuite';

import { EditGroup, EditSection } from '.';
import { t } from '@app/utility/lang'
import CommissionRateForm, { RateOptionsForm } from '@components/Form/CommissionRateForm';
import { CommissionTiersRow } from '@components/Profile/ProfileCommission';
import Placeholder from '@components/App/Placeholder';
import TextEditor from '@components/App/TextEditor';
import { useUser } from '@hooks/user';
import { useCommissionStore } from '@store/commission';
import { CommissionPhaseType } from '@server/constants';
import useUserStore from '@store/user';
import debounce from 'lodash/debounce';


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

export const RevisionsLimit = () => {
    return (
    <EditGroup title={t`Number of revisions allowed` + ':'}>
        <div className="w-32">
            <InputNumber defaultValue="3"/>
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
    let def_stages: CommissionPhaseType[], user, comm_store, user_store
    if (props.commission) {
        comm_store = useCommissionStore()
        def_stages = comm_store.get_commission().commission_process
    } else {
        user_store = useUserStore()
        user = user_store.state.current_user
        def_stages = user.commission_process
    }
    const [stages, set_stages] = useState(def_stages)

    const get_name = (v: CommissionPhaseType) => {
        switch (v) {
            case 'pending_approval':
                return t`Commission Approval`
            case 'pending_sketch':
                return t`Commission Initial Sketch`
            case 'pending_payment':
                return t`Commission Payment`
            case 'pending_product':
                return t`Commission Product`
            case 'complete':
                return t`Commission Complete`
            case 'unlock':
                return t`Commission Product Unlock`
        }
    }

    const get_collection = (v: CommissionPhaseType) => {
        switch (v) {
            case 'pending_approval':
                return 1
            case 'unlock':
                return 3
            case 'complete':
                return 4
            default:
                return 2
        }
    }

    const mounted = useMountedState()

    const update = debounce((data) => {
        if (props.commission) {
    
        } else {
            user_store.update_user({commission_process: data})
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
        set_stages(new_data)
    };


    return (
        <EditGroup>
            <List className="w-64" sortable onSort={handleSortEnd}>
                {stages.map((v, idx) =>
                <List.Item index={idx} collection={get_collection(v)} disabled={(['complete', 'pending_approval', 'unlock'] as CommissionPhaseType[]).includes(v)} key={v + idx.toString()}>{get_name(v)}</List.Item>)}
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
                <RevisionsLimit/>
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