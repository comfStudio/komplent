import React from 'react';
import { Panel, PanelGroup, Progress, Tag } from 'rsuite';
import { PanelContainer } from '@components/App/MainLayout';
import Image from '@components/App/Image';

import { t } from '@app/utility/lang'

const { Circle } = Progress

interface CommissionTitleProps {
    user?: any
}

export const CommissionTitle = (props: CommissionTitleProps) => {
    return (
        <div className="inline-block w-full leading-loose text-base">
            <span className="float-left mr-1"><Image w={30} h={30}/></span>
            Kanna Illustration
        </div>
    )
}

export const CommissionProgress = (props) => {
    return (
        <Panel>
            <CommissionTitle/>
            <div className="w-full text-center">
                <Circle percent={60} status="active" className="m-3 w-24 inline-block" />
            </div>
        </Panel>
    )
}

export const ActiveCommissions = () => {
    return (
        <PanelContainer bordered bodyFill header={(<h3 className="inline-block w-full">{t`Active Commissions`}<span className="ml-2"><Tag>4</Tag></span></h3>)}>
            <PanelGroup>
                <CommissionProgress/>
                <CommissionProgress/>
                <CommissionProgress/>
                <CommissionProgress/>
            </PanelGroup>
        </PanelContainer>
    );
};

export default ActiveCommissions;