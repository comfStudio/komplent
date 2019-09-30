import React from 'react';
import { Grid, Row, Col, Uploader, Icon, Button } from 'rsuite';

import Image from '@components/App/Image';
import { t } from '@utility/lang'
import { useCommissionStore } from '@store/commission';
import { useUser } from '@hooks/user';

interface ProductProps {
    is_owner: boolean
    commission: any
}

export const Product = (props: ProductProps) => {

    return (
        <div>
            <Image h="200px" />
            <div className="mt-2">
                <Button appearance="primary" block size="sm">{t`Download`}</Button>
                {!props.is_owner && !props.commission.finished &&
                <Button appearance="ghost" block size="sm">{t`Delete`}</Button>
                }
            </div>
        </div>
    )
}

const CommissionProducts = () => {

    const user = useUser()
    const store = useCommissionStore()
    const commission = store.get_commission()
    let is_owner = user._id === commission.from_user._id

    return (
        <Grid fluid>
            <Row>
                <Col xs={3}><Product commission={commission} is_owner={is_owner}/></Col>
                <Col xs={3}><Product commission={commission} is_owner={is_owner}/></Col>
                <Col xs={3}><Product commission={commission} is_owner={is_owner}/></Col>
                {!is_owner &&
                <Col xs={2}>
                <div className="text-center">
                    <Uploader multiple listType="picture" action="">
                        <button>
                        <Icon icon="plus" size="lg" />
                        </button>
                    </Uploader>
                </div>
                </Col>
                }
            </Row>
        </Grid>
    );
};

export default CommissionProducts;