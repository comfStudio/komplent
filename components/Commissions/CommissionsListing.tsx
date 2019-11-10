import React from 'react';
import Link from 'next/link';
import { List, Grid, Row, Col, Divider } from 'rsuite'

import { useCommissionsStore } from '@client/store/commission';
import { t } from '@utility/lang'
import { useUser } from '@hooks/user';
import * as pages from '@utility/pages';

export const RequestListing = () => {
    const user = useUser()
    const store = useCommissionsStore()

    const items = (comms) => comms.map(({_id, owner, from_title, to_title}) => {

        const title = owner ? from_title : to_title ? to_title : from_title

        return (
            <Link key={_id} href={pages.make_commission_urlpath({_id})}>
                <a className="unstyled">
                    <List.Item key={_id}>
                        {title}
                    </List.Item>
                </a>
            </Link>
        )
    })

    return (
        <Grid fluid className="mt-5">
            <Row>
                <Col xs={24}>
                <List hover bordered>
                    {items(store.state.commissions.filter(({to_user, accepted}) => to_user._id === user._id && !accepted).map(d => {return {...d, owner:false}}))}
                </List>
                </Col>
            </Row>
        </Grid>
    );
}

export const CommissionsListing = () => {

    const user = useUser()
    const store = useCommissionsStore()

    const items = (comms) => comms.map((d) => {

        const title = store.get_title(user._id, d)

        return (
            <Link key={d._id} href={pages.commission + `/${d._id}`}>
                <a className="unstyled">
                    <List.Item key={d._id}>
                        {title}
                    </List.Item>
                </a>
            </Link>
        )
    })

    const sort_by_title = (a, b) => {
        let nameA = store.get_title(user._id, a).toUpperCase(); // ignore upper and lowercase
        let nameB = store.get_title(user._id, b).toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }

    let to_comms = store.received_commissions(user._id)
    let from_comms = store.sent_commissions(user._id)

    let past_to_comms = to_comms.filter(d => d.finished)
    let past_from_comms = from_comms.filter(d => d.finished)

    to_comms = to_comms.filter(d => !d.finished)
    from_comms = from_comms.filter(d => !d.finished)

    to_comms.sort(sort_by_title)
    from_comms.sort(sort_by_title)

    return (
        <Grid fluid>
            <Row>
                <h4>{t`Commissions started by you`}</h4>
                <Col xs={24}>
                <List hover bordered>
                    {items(from_comms)}
                </List>
                </Col>
            </Row>
            {user.type === "creator" &&
            <Row>
                <h4>{t`On-going commissions`}</h4>
                <Col xs={24}>
                <List hover bordered>
                    {items(to_comms)}
                </List>
                </Col>
            </Row>
            }
            <Row>
                <h4>{t`Past commissions`}</h4>
                <Col xs={24}>
                {user.type === "creator" && <Divider className="!mt-2">{t`Sent`}</Divider>}
                <List hover bordered>
                    {items(past_from_comms)}
                </List>
                {user.type === "creator" && <Divider>{t`Received`}</Divider>}
                {user.type === "creator" &&
                <List hover bordered>
                    {items(past_to_comms)}
                </List>
                }
                </Col>
            </Row>
        </Grid>
    );
};

export default CommissionsListing;