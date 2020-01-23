import React, { useState, memo } from 'react';
import { Panel, Button } from 'rsuite';

import { t } from '@app/utility/lang'
import { useUser } from '@hooks/user';
import { fetch } from '@utility/request'
import * as pages from '@utility/pages'

const VerifyEmailPanel = memo(function VerifyEmailPanel(props) {
    const user = useUser()
    const email = user?.email
    const [sent, set_sent] = useState(false)

    return (
    <Panel header={<h4 className="text-primary">{t`Your email needs to be verified`}</h4>} {...props}>
            <p>{t`A confirmation email has been sent to ${email}. Click on the confirmation link in the email to verify your email.`}</p>
            <p>{t`Didn't receive the email?`}
            {!sent && <Button size="sm" className="!leading-none" appearance="link" onClick={() => {
                fetch(pages.misc, { method: "post", body: { send_confirmation_email: true }}).then(r => {
                    if (r.ok) {
                        set_sent(true)
                    }
                })
            }}>{t`Click here to resend the confirmation email.`}</Button>}
            {sent && <span className="text-primary ml-1">{t`A new confirmation email has been sent!`}</span>}
            </p>
        </Panel>
    );
})

export default VerifyEmailPanel;