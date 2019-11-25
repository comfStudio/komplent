import React, { Component, useState } from 'react'

import { Grid, Col, Row, InputGroup, Button, Icon } from 'rsuite'

import { Container, MainLayout } from '@components/App/MainLayout'
import InboxSidebar from '@components/Inbox/InboxSidebar'
import InboxSearch from '@components/Inbox/InboxSearch'
import InboxList from '@components/Inbox/InboxList'
import InboxConversation from '@components/Inbox/InboxConversation'

import { t } from '@app/utility/lang'
import NewConvoModal from './NewConvoModal'
import { InboxKey } from '@store/inbox'

interface Props {
    activeKey?: InboxKey
}

const InboxLayout = (props: Props) => {
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
                    <Col xs={3}>
                        <InboxSidebar activeKey={props.activeKey} />
                    </Col>
                    <Col xs={6}>
                        <InboxList />
                    </Col>
                    <Col xs={15}>
                        <InboxConversation />
                    </Col>
                </Row>
            </Grid>
        </MainLayout>
    )
}

export default InboxLayout
