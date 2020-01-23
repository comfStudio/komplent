import React, { memo } from 'react'
import { Panel } from 'rsuite'

import { t } from '@app/utility/lang'

import './MatureContent.scss'

const MatureContent = memo(function MatureContent() {
    return (
        <Panel
            bodyFill
            bordered
            className="mature-content"
            header={
                <h2>{t`You are about to enter a section suitable only to mature audiences`}</h2>
            }></Panel>
    )
})

export default MatureContent
