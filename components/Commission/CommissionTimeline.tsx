import React from 'react';
import { Timeline, Icon, Panel } from 'rsuite';
import { ReactProps } from '@utility/props';
import { formatDistanceToNow, format, toDate } from 'date-fns'

import { capitalizeFirstLetter } from '@utility/misc';

import './CommissionTimeline.scss'

interface TimelineTitleProps extends ReactProps {
    date?: Date | string
}


export const TimelineTitle = (props: TimelineTitleProps) => {

    toDate
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
        <React.Fragment>
            {props.children} {!!date && <span className="muted text-sm">- ({format(date as Date, "yyyy-MM-dd - HH:mm:ss")})</span>}
        </React.Fragment>
    )
}

export const TimelinePanel = (props: ReactProps) => {
    return (
        <div bordered className="timeline-panel">
            {props.children}
        </div>
    )
}

export const CommissionTimelineItem = (props: ReactProps) => {
    return (
        <Timeline.Item>
            {props.children}
        </Timeline.Item>
    )
}

const CommissionTimeline = (props: ReactProps) => {
    return (
        <Timeline>
            {props.children}
        </Timeline>
);
};

export default CommissionTimeline;