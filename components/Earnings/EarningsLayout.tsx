import React, { memo } from 'react'

import MainLayout from '@components/App/MainLayout'
import { EarningsKey } from '@store/earnings'
import { ReactProps } from '@utility/props'
import EarningsMenu from './EarningsMenu'

interface Props extends ReactProps {
    activeKey?: EarningsKey
}

const EarningsLayout = memo(function EarningsLayout(props: Props) {
    return (
        <MainLayout
            activeKey={props.activeKey}
            paddedTop
            header={<EarningsMenu activeKey={props.activeKey} />}>
            {props.children}
        </MainLayout>
    )
})

export default EarningsLayout
