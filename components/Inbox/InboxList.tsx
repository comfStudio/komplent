import React from 'react';
import { Panel, PanelGroup } from 'rsuite'

import Placeholder from '@components/App/Placeholder'

const InboxList = () => {
    return (
        <PanelGroup>
            <Panel header="John Murphy (2)">
            <Placeholder type="text" rows={2}/>
            </Panel>
            <Panel header="Markman">
            <Placeholder type="text" rows={2}/>
            </Panel>
            <Panel header="Twiddly (1)">
            <Placeholder type="text" rows={2}/>
            </Panel>
        </PanelGroup>
    );
};

export default InboxList;