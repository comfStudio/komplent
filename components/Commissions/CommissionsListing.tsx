import React from 'react';
import Link from 'next/link';
import { List, Grid, Row, Col } from 'rsuite'

import { useCommissionsStore } from '@store/commission';
import { t } from '@utility/lang'
import { useUser } from '@hooks/user';
import * as pages from '@utility/pages';

const CommissionsListing = () => {

    const user = useUser()
    const [state, actions] = useCommissionsStore()

    const items = (comms) => comms.map(({_id, owner, from_title, to_title}) => {

        const title = owner ? from_title : to_title ? to_title : from_title

        return (
            <Link key={_id} href={pages.commission + `/${_id}`}>
                <a className="unstyled">
                    <List.Item key={_id}>
                        {title}
                    </List.Item>
                </a>
            </Link>
        )
    })

    return (
        <Grid fluid>
            <Row>
                <h4>{t`Commissions started by you`}</h4>
                <Col xs={24}>
                <List hover bordered>
                    {items(state.commissions.filter(({from_user}) => from_user._id === user._id).map(d => {return {...d, owner:true}}))}
                </List>
                </Col>
            </Row>
            <Row>
                <h4>{t`On-going commissions`}</h4>
                <Col xs={24}>
                <List hover bordered>
                    {items(state.commissions.filter(({to_user}) => to_user._id === user._id).map(d => {return {...d, owner:false}}))}
                </List>
                </Col>
            </Row>
        </Grid>
    );
};

export default CommissionsListing;