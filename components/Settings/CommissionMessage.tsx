import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSessionStorage, useMountedState, useDebounce } from 'react-use';
import { InputNumber, List, Grid, Button, DatePicker, Icon, Message, Input, Row, Col } from 'rsuite';

import { EditGroup, EditSection } from '.';
import { t } from '@app/utility/lang'
import CommissionRateForm, { RateOptionsForm } from '@components/Form/CommissionRateForm';
import { CommissionTiersRow } from '@components/Profile/ProfileCommission';
import Placeholder from '@components/App/Placeholder';
import TextEditor from '@components/App/TextEditor';
import { useCommissionStore } from '@store/commission';
import { CommissionPhaseType, CommissionPhaseT, guideline_types, GuidelineType, Guideline } from '@server/constants';
import useUserStore from '@store/user';
import debounce from 'lodash/debounce';
import { CommissionProcessType } from '@schema/user';
import { useUpdateDatabase } from '@hooks/db';
import { text_schema } from '@schema/general';
import { useUser } from '@hooks/user';

interface MessageTextProps {
    message_key: string
}

export const MessageText = (props: MessageTextProps) => {
    const store = useUserStore()
    const user = store.state.current_user
    const update = useUpdateDatabase(user[props.message_key] ?? null, text_schema, true)
    const [ delta, set_delta ] = useState()

    useDebounce(() => {
        update('Text', {data: delta}, text_schema, true, !!!user[props.message_key]).then(r => {
            if (r.status && !user[props.message_key]) {
                let data = {}
                data[props.message_key] = r.body.data
                store.update_user(data)
            }
        })
    }, 800, [delta])
    
    return (
        <EditGroup>
            <TextEditor defaultDelta={user[props.message_key] ? user[props.message_key].data : undefined} onTextChange={({delta}) => set_delta(delta)}/>
        </EditGroup>
    )
}


export const RequestMessage = () => {
    return (
        <Grid fluid>
            <EditSection>
                <h4 className="muted">{t`A message shown when a commission is requested.`}</h4>
                <MessageText message_key="commission_request_message"/>
            </EditSection>
        </Grid>
    );
};

export const AcceptMessage = () => {
    return (
        <Grid fluid>
            <EditSection>
                <h4 className="muted">{t`A message shown when a commission request has been accepted.`}</h4>
                <MessageText message_key="commission_accept_message"/>
            </EditSection>
        </Grid>
    );
};