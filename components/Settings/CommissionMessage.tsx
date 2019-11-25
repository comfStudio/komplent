import React from 'react'
import { Grid } from 'rsuite'

import { EditGroup, EditSection } from '.'
import MessageText from '@components/App/MessageText'
import { t } from '@app/utility/lang'

export const RequestMessage = () => {
    return (
        <Grid fluid>
            <EditSection>
                <h4 className="muted">{t`A message shown when a commission is requested.`}</h4>
                <EditGroup>
                    <MessageText message_key="commission_request_message" />
                </EditGroup>
            </EditSection>
        </Grid>
    )
}

export const AcceptMessage = () => {
    return (
        <Grid fluid>
            <EditSection>
                <h4 className="muted">{t`A message shown when a commission request has been accepted.`}</h4>
                <EditGroup>
                    <MessageText message_key="commission_accept_message" />
                </EditGroup>
            </EditSection>
        </Grid>
    )
}
