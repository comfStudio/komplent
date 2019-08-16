import React from 'react';

import { Button } from 'antd'

import { t } from '@app/utility/lang'
import { HTMLElementProps } from '@utility/props'

export const CommissionButton = (props: HTMLElementProps) => {
    let cls = "commission-button"
    return (
        <Button type="primary" size="large" className={props.className ? cls + ' ' + props.className : cls}>{t`Request a Commission`}</Button>
    );
};