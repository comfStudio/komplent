import React, { memo } from 'react'
import { useRouter } from 'next/router'
import { Input, InputGroup, Icon } from 'rsuite'

import { t } from '@app/utility/lang'

const { Button } = InputGroup

export const MainSearch = memo(function MainSearch() {
    const router = useRouter()

    return (
        <form action="/search" method="GET">
            <InputGroup inside className="text-left !w-5/6 !max-w-6xl m-auto">
                <Input
                    name="q"
                    defaultValue={router.query.q as string}
                    placeholder={t`What are you looking for?`}
                />
                <Button>
                    <Icon icon="search"></Icon>
                </Button>
            </InputGroup>
        </form>
    )
})

export default MainSearch
