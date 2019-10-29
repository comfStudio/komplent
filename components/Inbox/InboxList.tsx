import React, { useState } from 'react';
import { Panel, PanelGroup, List } from 'rsuite'
import Link from 'next/link';

import Placeholder from '@components/App/Placeholder'
import useInboxStore from '@store/inbox';
import { useUser } from '@hooks/user';
import { get_profile_name } from '@utility/misc';
import { make_conversation_urlpath } from '@utility/pages';

interface InboxListItemProps {
    data: any
}

const InboxListItem = (props: InboxListItemProps) => {
    const user = useUser()
    const store = useInboxStore()

    const [loading, set_loading] = useState(false)

    const p_users = props.data.users.filter(v => v._id !== user._id)

    return (
        <Link href={make_conversation_urlpath(store.state.activeKey, props.data)}>
        <a className="unstyled">
            <List.Item>
                {!loading &&
                <>
                <p>{props.data.subject}</p>
                <p className="muted">{p_users.map(v => get_profile_name(v)).join(",")}</p>
                </>}
                {loading && <Placeholder type="text" rows={2}/>}
            </List.Item>
        </a>
        </Link>
    )
}

const InboxList = () => {

    const store = useInboxStore()

    return (
        <List hover>
            {store.state.conversations.map(d => <InboxListItem key={d._id} data={d}/> )}
        </List>
    );
};

export default InboxList;