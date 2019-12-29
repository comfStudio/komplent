import React from 'react'

import { useRouter } from 'next/router'
import { Input, InputGroup, Icon } from 'rsuite'

const { Button } = InputGroup

import { t } from '@app/utility/lang'

const CommissionsSearch = () => {

    const router = useRouter()

    return (
        <form action={router.asPath} method="GET">
            <InputGroup inside className="text-left !w-5/6 !max-w-6xl m-auto">
                {router.query.type && <input name="type" value={router.query.type} hidden/>}
                <Input name="commissions_q" defaultValue={router.query?.commissions_q as string} placeholder={t`Search your commissions`} />
                <Button componentClass="button" type="submit">
                    <Icon icon="search"></Icon>
                </Button>
            </InputGroup>
        </form>
    )
}

export default CommissionsSearch
