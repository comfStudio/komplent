import React, { Component, useState } from 'react'

import { Grid, Col, Row, InputGroup, Button, Icon, ButtonGroup, FlexboxGrid } from 'rsuite'
import Link from 'next/link'
import { useRouter } from 'next/router'
import qs from 'qs'

import { Container, MainLayout } from '@components/App/MainLayout'
import InboxSidebar from '@components/Inbox/InboxSidebar'
import InboxSearch from '@components/Inbox/InboxSearch'
import InboxList from '@components/Inbox/InboxList'
import InboxConversation from '@components/Inbox/InboxConversation'

import { t } from '@app/utility/lang'
import NewConvoModal from './NewConvoModal'
import useInboxStore, { InboxKey } from '@store/inbox'
import * as pages from '@utility/pages'

interface Props {
    activeKey?: InboxKey
}

const InboxLayout = (props: Props) => {
    const router = useRouter()
    const store = useInboxStore()

    const btn_state = {
        commission: router.query.type === 'commission' || router.query.type === undefined,
        staff: router.query.type === 'staff',
        private: router.query.type === 'private',
    }

    const [show, set_show] = useState(false)

    return (
        <MainLayout activeKey="inbox">
            {show && (
                <NewConvoModal
                    show={show}
                    onClose={() => {
                        set_show(false)
                    }}
                />
            )}
            <Grid fluid className="mt-2">
                <Row>
                    <Col xs={4}>
                        <Button
                            appearance="primary"
                            onClick={ev => {
                                ev.preventDefault()
                                set_show(true)
                            }}>
                            <Icon icon="plus" /> {t`New conversation`}
                        </Button>
                    </Col>
                    <Col xs={20}>
                        <InboxSearch />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col xsPush={3} xs={21} className="clearfix mb-2">
                        <ButtonGroup>
                            <Link href={pages.inbox + '?' + qs.stringify({ type:'commission' })} passHref>
                                <Button active={btn_state.commission} componentClass="a">{t`Commission`}</Button>
                            </Link>
                            <Link href={pages.inbox + '?' + qs.stringify({ type:'private' })} passHref>
                                <Button active={btn_state.private} componentClass="a">{t`Personal`}</Button>
                            </Link>
                            <Link href={pages.inbox + '?' + qs.stringify({ type:'staff' })} passHref>
                                <Button active={btn_state.staff} componentClass="a">{t`Staff`}</Button>
                            </Link>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} xs={3}>
                                <InboxSidebar activeKey={props.activeKey} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item className="!flex-grow" colspan={21} componentClass={Col} xs={6}>
                                <InboxList />
                            </FlexboxGrid.Item>
                            {!!store.state.active_conversation &&
                            <FlexboxGrid.Item componentClass={Col} xs={15}>
                                <InboxConversation />
                            </FlexboxGrid.Item>
                            }
                        </FlexboxGrid>
                    </Col>
                </Row>
            </Grid>
        </MainLayout>
    )
}

export default InboxLayout
