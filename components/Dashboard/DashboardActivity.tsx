import React from 'react';
import { Panel, PanelGroup, Avatar } from 'rsuite';
import Link from 'next/link';

import { useNotificationStore } from '@store/user';
import { EVENT } from '@server/constants';

import { t } from '@app/utility/lang'
import { make_profile_urlpath } from '@utility/pages';
import { get_profile_name } from '@utility/misc';

interface NotificationProps {
    data: any
}

const Notification = (props: NotificationProps) => {
    
    let type_text = "Unknown"
    let link_to = "#"
    const data = props.data
    const from_user = data.from_user
    link_to = make_profile_urlpath(from_user)

    switch (props.data.type) {
        case EVENT.changed_commission_status: {
            type_text = data.data.status ? t`Opened up for commissions!` : t`Closed for commissions`
            break
        }
        case EVENT.added_product: {
            type_text = t`Added a new commission rate, check it out!`
            break
        }
        case EVENT.updated_notice: {
            let message = data.data.message 
            type_text = t`Set a public message: ${message}`
            break
        }
        case EVENT.followed_user: {
            type_text = t`Followed you!`
            break
        }
    }

    return (
        <Panel bordered bodyFill header={
            <span>
                <Link href={link_to}>
                    <a className="unstyled">
                        <div className="inline mr-2">
                            <Avatar className="mr-2">A</Avatar>
                            {get_profile_name(from_user)}
                        </div>
                    </a>
                </Link>
                <strong>{type_text}</strong>
            </span>
        }/>
    )
}

const DashboardActivity = () => {

    const store = useNotificationStore()

    return (
        <PanelGroup>
            {store.state.notifications.map(d => {
                return (
                    <Notification key={d._id} data={d}/>
                )
            })}
        </PanelGroup>
    );
};

export default DashboardActivity;