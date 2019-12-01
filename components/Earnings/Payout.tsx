import React, { useState } from 'react';
import { Panel, Button } from "rsuite"
import { t } from '@app/utility/lang'

export const PayoutBalance = () => {
    return (
        <Panel bordered header={<h4>{t`Balance`}</h4>}>
            <p>
                <span className="text-primary text-4xl">
                    $ 59945
                </span>
            </p>
            <p>
                <Button appearance="primary">
                    {t`Widthdraw`}
                </Button>
            </p>
        </Panel>
    )
}