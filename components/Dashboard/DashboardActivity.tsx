import React, { useState, useEffect, useRef } from 'react'
import { Panel, PanelGroup, Avatar, Button } from 'rsuite'
import Link from 'next/link'
import classnames from 'classnames'
import VisibilitySensor from 'react-visibility-sensor'
import { formatDistanceToNow } from 'date-fns'

import { useNotificationStore } from '@store/user'
import { EVENT } from '@server/constants'

import { t } from '@app/utility/lang'
import { make_profile_urlpath, make_commission_urlpath } from '@utility/pages'
import { get_profile_name, get_profile_avatar_url, get_commission_title, is_server } from '@utility/misc'
import Image from '@components/App/Image'
import { useUser } from '@hooks/user'
import { fetch } from '@utility/request'

import './DashboardActivity.scss'

interface NotificationProps {
    data: any
}

const CommissionTitle = ({commission_id, user, className}: {commission_id: string, user: any, className?: string}) => {
    const [title, set_title] = useState()

    useEffect(() => {
        if (commission_id) {
            fetch('/api/fetch', {
                method: 'post',
                body: {
                    model: 'Commission',
                    method: 'findById',
                    query: commission_id,
                    select: "to_title from_title, to_user",
                },
            }).then(async r => {
                if (r.ok) {
                    set_title(get_commission_title((await r.json()).data, user))
                }
            })
        }
    }, [commission_id, user])

    return <span className={className}>{t`The commission`} <span className="font-bold commission-title">{title}</span> {t`has been updated`}</span>
}

const Notification = (props: NotificationProps) => {

    const user = useUser()
    const store = useNotificationStore()
    const [data, set_data] = useState(props.data)
    const ref = useRef()

    let type_text = t`Unknown`
    let content: any = t`Unknown`
    let link_to = '#'
    const from_user = data.from_user
    const is_owner = user._id === from_user._id
    link_to = make_profile_urlpath(from_user)
    let avatar_el = <Image src={get_profile_avatar_url(from_user)} className="avatar" w={50} h={50}/>
    let link_el = (
        <>
            {get_profile_name(from_user)}
        </>
    )

    useEffect(() => {
        set_data(props.data)
    }, [props.data])


    switch (data.type) {
        case EVENT.changed_commission_status: {
            type_text = t`Creator`
            content = data.data.status
                ? t`opened up for commissions!`
                : t`closed for commissions`
            break
        }
        case EVENT.added_product: {
            type_text = t`Creator`
            content = t`added a new commission rate, check it out!`
            break
        }
        case EVENT.notice_changed: {
            type_text = t`Creator`
            let message = data.data.message
            content = t`set a public message: ${message}`
            break
        }
        case EVENT.followed_user: {
            type_text = t`User`
            content = t`followed you!`
            break
        }
        case EVENT.commission_phase_updated: {
            type_text = t`Commission`
            link_to = make_commission_urlpath({
                _id: data.data.commission_id,
            })
            get_profile_name
            link_el = null
            content = <CommissionTitle commission_id={data.data.commission_id} user={user}/>
            break
        }
    }

    const date = formatDistanceToNow(data?.created ? new Date(data.created) : new Date(), { addSuffix: true })

    return (
        <Panel
            ref={ref}
            bordered
            bodyFill
            className={classnames("notification", {unread: !!!props.data.read})}>
            <Link href={link_to}>
                <a className="unstyled">
                <VisibilitySensor scrollCheck={true} onChange={v => {
                    if (v && !!!data.read) {
                        store.read_notification(data._id)
                    }
                }}>
                <div className="content">
                    <small className="header muted">
                        <span className="type">{type_text}</span><span className="date">{date}</span>
                    </small>
                    <div className="body">
                        {!!avatar_el && avatar_el}
                        <div>
                            <span className="font-bold">{link_el} </span> {content}
                        </div>
                    </div>
                </div>
                </VisibilitySensor>
                </a>
            </Link>

        </Panel>
    )
}

const DashboardActivity = () => {
    const store = useNotificationStore()
    const user = useUser()

    const [loading, set_loading] = useState(false)
    const [page, set_page] = useState(0)

    return (
        <>
        <PanelGroup>
            {store.state.notifications.map(d => {
                return <Notification key={d._id} data={d} />
            })}
        </PanelGroup>
        <div className="text-center w-full my-2"><Button loading={loading} appearance="subtle" onClick={ev => {
            ev.preventDefault();
            const next_page = page + 1
            set_page(next_page)
            set_loading(true)

            store.get_notifications(user, next_page).then(r => {
                store.setState({notifications: [...store.state.notifications, ...r]})
                set_loading(false)
            })

        }}>{t`Load more`}</Button></div>
        </>
    )
}

export default DashboardActivity
