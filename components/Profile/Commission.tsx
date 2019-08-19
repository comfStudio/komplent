import { Button, Card } from 'rsuite'

import Link from 'next/link'

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './Commission.scss'

export const CommissionButton = (props: HTMLElementProps) => {
    let cls = "commission-button"
    return (
        <Link href="profile/commission">
            <Button type="primary" size="large" className={props.className ? cls + ' ' + props.className : cls}>
                {t`Request a Commission`}
            </Button>
        </Link>
    );
};

interface CommissionCardProps extends HTMLElementProps {

}

export const CommissionCard = (props: CommissionCardProps) => {
    let cls = "commission-card"
    return (
        <Card className={props.className ? cls + ' ' + props.className : cls}>
            <Skeleton loading={true} active avatar></Skeleton>
        </Card>
    );
};