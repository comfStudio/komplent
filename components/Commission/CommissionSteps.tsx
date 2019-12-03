import React, { Children } from 'react'
import { Timeline, Icon, Panel, Steps } from 'rsuite'
import { ReactProps, HTMLElementProps } from '@utility/props'
import { formatDistanceToNow, format, toDate } from 'date-fns'

import { capitalizeFirstLetter } from '@utility/misc'

import './CommissionSteps.scss'
import _ from 'lodash'

interface StepTitleProps extends ReactProps {
    date?: Date | string
    onClick?: any
}

export const StepTitle = (props: StepTitleProps) => {
    let date = props.date
    if (date) {
        if (typeof date === 'string') {
            date = toDate(new Date(date))
        }
        if (isNaN(date.getTime())) {
            date = null
        }
    }
    return (
        <span onClick={props.onClick} className="">
            <h4 className="inline">{props.children}</h4>
            {!!date && (
                <span className="muted ml-1 text-sm">
                    - ({format(date as Date, 'yyyy-MM-dd - HH:mm:ss')})
                </span>
            )}
        </span>
    )
}

interface StepPanelProps extends ReactProps, HTMLElementProps {}

export const StepPanel = (props: StepPanelProps) => {
    let cls = '' // 'step-panel'
    return (
        <div className={props.className ? props.className + ' ' + cls : cls}>
            {props.children}
        </div>
    )
}

export interface CommissionStepItemProps extends ReactProps {
    active?: boolean
    selected?: boolean
    status?: 'finish'|'wait'|'process'|'error' 
}

export const CommissionStepItem = (props: CommissionStepItemProps) => {

    let comps = Children.toArray(props.children)
    let title = _.remove(comps, v => v.type === StepTitle)

    return (
        <Steps.Item
            status={props.status}
            title={title?.[0]}
            description={<>{comps}</>}
            className={
                'item' +
                (props.active ? ' active' : '') +
                (props.selected ? ' selected' : '')
            }/>
    )
}

interface CommissionStepProps extends ReactProps, HTMLElementProps {
    current?: number
    status?: 'finish'|'wait'|'process'|'error' 
}

const CommissionSteps = (props: CommissionStepProps) => {
    let cls = '' //'commission-step'
    return (
        <Steps
            current={props.current}
            status={props.status}
            className={props.className ? props.className + ' ' + cls : cls} vertical>
            {props.children}
        </Steps>
    )
}

export default CommissionSteps
