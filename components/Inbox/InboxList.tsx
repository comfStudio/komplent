import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, List, Placeholder, Badge, Button } from 'rsuite'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classnames from 'classnames'

import useInboxStore from '@store/inbox'
import { useUser } from '@hooks/user'
import { get_profile_name, get_profile_avatar_url } from '@utility/misc'
import { make_conversation_urlpath } from '@utility/pages'
import Image from '@components/App/Image'
import { t } from '@app/utility/lang'

interface InboxListItemProps {
    data: any
}

const InboxListItem = (props: InboxListItemProps) => {
    const user = useUser()
    const store = useInboxStore()
    const router = useRouter()

    const [loading, set_loading] = useState(false)
    const [unread, set_unread] = useState(false)

    const p_users = props.data.users.filter(v => v._id !== user?._id)

    useEffect(() => {

        if (props.data) {
            store.get_conversation_read_status(props.data._id, user._id).then(r => {
                set_unread(!!r)
            })
        }

    }, [props.data?._id, user?._id, props.data._id === store.state.active_conversation._id])

    return (
        <Link
            href={make_conversation_urlpath(store.state.activeKey, props.data, router.query)}>
            <a className="unstyled">
                <List.Item className={classnames({'!bg-gray-100': props.data._id === store.state.active_conversation._id})}>
                    {!loading && (
                        <div className="flex">
                            <span className="self-center mr-2">
                                <Image src={get_profile_avatar_url(p_users[0])} className="avatar !w-10 !h-10" w={35} h={35}/>
                            </span>
                            <span className="flex-grow">
                                <p>{props.data.subject}</p>
                                <p className="muted">
                                    {p_users
                                        .map(v => get_profile_name(v) + ` (@${v.username})`)
                                        .join(',')}
                                </p>
                            </span>
                            <span className="self-center ml-1">
                                {unread && <Badge/>}
                            </span>
                        </div>
                    )}
                    {loading && <Placeholder.Paragraph rows={2} />}
                </List.Item>
            </a>
        </Link>
    )
}

const InboxList = () => {
    const user = useUser()
    const router = useRouter()
    const store = useInboxStore()
    const [loading, set_loading] = useState(false)
    const [page, set_page] = useState(0)
    const inbox_type = (router.query.type as string) ?? 'commission'

    useEffect(() => {
        set_page(0)
    }, [router.query])

    return (
        <List hover className="conversation-list">
            {store.state.conversations.map(d => (
                <InboxListItem key={d._id} data={d} />
            ))}
            <div className="text-center w-full my-2"><Button loading={loading} appearance="subtle" onClick={ev => {
                ev.preventDefault();
                const next_page = page + 1
                set_page(next_page)
                set_loading(true)

                store.search_conversations(user, inbox_type as any, router.query.inbox_q, { page: next_page}).then(r => {
                    store.setState({conversations: [...store.state.conversations, ...r]})
                    set_loading(false)
                })

                }}>{t`Load more`}</Button></div>
        </List>
    )
}

export default InboxList
