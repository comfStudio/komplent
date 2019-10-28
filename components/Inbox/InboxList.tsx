import React, { useState } from 'react';
import { Panel, PanelGroup } from 'rsuite'

import Placeholder from '@components/App/Placeholder'

interface InboxListItemProps {
    data: any
}

const InboxListItem = (props: InboxListItemProps) => {
    const [loading, set_loading] = useState(false)

    return (
        <Panel header="John Murphy (2)">
            {loading && <Placeholder type="text" rows={2}/>}
            {!loading &&
            <p></p>
            }
        </Panel>
    )
}

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