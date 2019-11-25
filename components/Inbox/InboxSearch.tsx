import React from 'react'

import { Input, InputGroup, Icon } from 'rsuite'

const { Button } = InputGroup

import { t } from '@app/utility/lang'

const InboxSearch = () => {
    return (
        <form action="search" method="GET">
            <InputGroup inside className="text-left !w-5/6 !max-w-6xl m-auto">
                <Input name="q" placeholder={t`Search your conversations`} />
                <Button>
                    <Icon icon="search"></Icon>
                </Button>
            </InputGroup>
        </form>
    )
}

export default InboxSearch
