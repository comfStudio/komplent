import React from 'react';
import { Timeline, Icon, Panel } from 'rsuite';
import { ReactProps, HTMLElementProps } from '@utility/props';
import { formatDistanceToNow, format, toDate } from 'date-fns'

import { capitalizeFirstLetter } from '@utility/misc';

import './CommissionTimeline.scss'

interface TimelineTitleProps extends ReactProps {
    date?: Date | string
    onClick?: any
}


export const TimelineTitle = (props: TimelineTitleProps) => {

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
        <span onClick={props.onClick} className="title">
            <h4 className="inline">{props.children}</h4>
            {!!date && <span className="muted ml-1 text-sm">- ({format(date as Date, "yyyy-MM-dd - HH:mm:ss")})</span>}
        </span>
    )
}

interface TimelinePanelProps extends ReactProps, HTMLElementProps {

}

export const TimelinePanel = (props: TimelinePanelProps) => {
    let cls = "timeline-panel"
    return (
        <div className={props.className ? (props.className + " " + cls) : cls}>
            {props.children}
        </div>
    )
}

interface CommissionTimelineItemProps extends ReactProps {
    active?: boolean
    selected?: boolean
}

export const CommissionTimelineItem = (props: CommissionTimelineItemProps) => {
    return (
        <Timeline.Item className={"item" + (props.active ? " active" : "") + (props.selected ? " selected" : "")}>
            {props.children}
        </Timeline.Item>
    )
}

interface CommissionTimelineProps extends ReactProps, HTMLElementProps {

}

const CommissionTimeline = (props: CommissionTimelineProps) => {
    let cls = "commission-timeline"
    return (
        <Timeline className={props.className ? (props.className + " " + cls) : cls}>
            {props.children}
        </Timeline>
);
};

export default CommissionTimeline;