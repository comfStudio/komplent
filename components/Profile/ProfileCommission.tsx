import React, { useState } from 'react';
import { Button, Panel, Row, Col, Grid, Input, Form, Uploader, Icon, Toggle, Schema, FormControl, RadioGroup, Radio, FormGroup, Checkbox, Message, ControlLabel } from 'rsuite'
import Link from 'next/link'
import qs from 'qs'
import { useRouter } from 'next/router';

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './ProfileCommission.scss'
import Placeholder from '@components/App/Placeholder';
import Image from '@components/App/Image'
import { useProfileContext, useProfileUser, useUser } from '@hooks/user';
import { GuidelineList } from '@app/components/Profile'
import { useCommissionRateStore, useCommissionStore } from '@client/store/commission';
import { decimal128ToFloat, moneyToString, stringToMoney, decimal128ToMoney, decimal128ToMoneyToString } from '@utility/misc';
import * as pages from '@utility/pages';
import { make_profile_urlpath } from '@utility/pages';
import { RateOptions } from '@components/Form/CommissionRateForm';
import TextEditor from '@components/App/TextEditor';
import { ButtonProps } from 'rsuite/lib/Button';

const { StringType, NumberType, BooleanType, ArrayType, ObjectType } = Schema.Types;

// returns a new array
const sort_rates_by_price = (rates) => {
    return [...rates].sort((a, b) => decimal128ToFloat(a.price) - decimal128ToFloat(b.price))
}

interface CommissionButtonProps extends HTMLElementProps, ButtonProps {
    user?: any
}

export const CommissionButton = ({user, appearance = "primary", size="lg", children, ...props}: CommissionButtonProps) => {
    let path
    if (user) {
        path = make_profile_urlpath(user)
    } else {
        const { profile_path } = useProfileContext()
        path = profile_path
    }
    let cls = "commission-button"
    return (
        <Link href={`${path}/commission`}>
            <Button appearance={appearance} size={size} className={props.className ? cls + ' ' + props.className : cls} {...props}>
                { children ? children : t`Request a Commission`}
            </Button>
        </Link>
    );
};

interface TotalPriceProps extends ReactProps, HTMLElementProps {}

export const TotalPriceDisplay = (props: TotalPriceProps) => {
    let cls = "text-xl leading-loose"
    return (
        <span className={props.className ? cls + ' ' + props.className : cls}>
            Total Price: <span className="text-primary">{props.children}</span>
        </span>
    );
};

interface CommissionCardProps extends HTMLElementProps {
    data: any
    selected?: boolean
}

const CommissionCardHeader = (props: CommissionCardProps) => {
    let { price, title, extras, negotiable } = props.data

    return (<Grid className="header !w-full">
        <Row>
            <Col xs={8}>
                <span className="price">{decimal128ToMoneyToString(price)}</span>
            </Col>
            <Col xs={16}>
                <h4 className="title inline-block">{title}</h4>
            </Col>
        </Row>
        {negotiable && 
        <Row>
            <Col xs={24} className="text-center">
                <span className="text-primary">{t`Negotiable`}</span>
            </Col>
        </Row>
        }
        <Row className="extra-row">
            {
            extras.map(({title: extra_title, price: extra_price, _id: extra_id},index) => (
                <Col key={extra_id} xs={24}>
                        <small className="extra">+ {decimal128ToMoneyToString(extra_price)} - {extra_title}</small>
                </Col>
    )       )
            }
        </Row>
    </Grid>)
}

export const CommissionCard = (props: CommissionCardProps) => {
    let cls = "commission-card mx-auto"
    if (props.selected)
        cls += " selected"
    return (
        <Panel bodyFill className={props.className ? cls + ' ' + props.className : cls} bordered>
            <CommissionCardHeader {...props}/>
            <Image w="100%" h={250}/>
            {props.selected && <span className="select-box">Selected</span>}
        </Panel>
    );
};

export const CommissionLinkCard = (props: CommissionCardProps) => {
    const user = useUser()
    let c_user = props.data.user
    let url = make_profile_urlpath(c_user)
    if (!user || !c_user || (user._id !== c_user._id)) {
        url = pages.make_commission_rate_urlpath(c_user, props.data)
    }
    
    return (
        <Link href={url}>
        <a>
            <CommissionCard {...props}/>
        </a>
        </Link>
    )
}

export const CommissionCardRadioGroup = () => {
    const router = useRouter()
    const store = useCommissionRateStore()
    
    const selected_rate = router.query.selected || ''

    return (
        <Row gutter={16} className="commission-rates-group">
            {
                sort_rates_by_price(store.state.rates).map((data ,index) => {
                    let el = (
                        <Col key={data._id} xs={6}>
                                <label title={data.title}>
                                    <FormControl className="mb-2" type="radio" name="commission_rate" value={data._id} defaultChecked={selected_rate===data._id} /> 
                                    <CommissionCard data={data}/>
                                </label>
                        </Col>
                    )
                    return el
                })
            }
        </Row>
)
}

export const CommissionTiersRow = (props: any) => {

    const store = useCommissionRateStore()
    return (
        <Row gutter={16}>
            {
                sort_rates_by_price(store.state.rates).map((data ,index) => {
                    let el = (
                        <Col key={data._id} xs={6}>
                            <CommissionLinkCard data={data}/>
                        </Col>
                    )
                    return el
                })
            }
        </Row>
    )
}

const Attachments = (props) => {
    const fileList = [
        {
          name: 'a.png',
          fileKey: 1,
          url:
            'https://user-images.githubusercontent.com/1203827/47638792-92414e00-db9a-11e8-89c2-f8f430a23cd3.png'
        },
        {
          name: 'b.png',
          fileKey: 2,
          url:
            'https://user-images.githubusercontent.com/1203827/47638807-9d947980-db9a-11e8-9ee5-e0cc9cd7e8ad.png'
        }
      ];

    return (
        <Uploader listType="picture" defaultFileList={fileList} action="//jsonplaceholder.typicode.com/posts/">
            <button>
                <Icon icon='camera-retro' size="lg" />
            </button>
        </Uploader>
    )
}

const commission_request_model = Schema.Model({
    from_title: StringType().isRequired(t`This field is required.`),
    commission_rate: StringType().isRequired(t`This field is required.`),
    extras: ArrayType(),
    body: StringType().isRequired(t`This field is required.`),
    tos: StringType().isRequired(t`This field is required.`),
  });


export const ProfileCommission = () => {
    const router = useRouter()

    const selected_rate = router.query.selected || ''

    const from_user = useUser()
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({
        commission_rate: selected_rate || undefined
    })
    const [error, set_error] = useState(null)
    const [loading, set_loading] = useState(false)
    
    const commission_store = useCommissionStore()
    const store = useCommissionRateStore()

    let selected_rate_obj = null

    let total_price = stringToMoney("0.0")

    if (form_value.commission_rate) {
        for (let c of store.state.rates) {
            if (c._id === form_value.commission_rate) {
                selected_rate_obj = c
                total_price = total_price.add(decimal128ToMoney(c.price))
                break
            }
        }
    }

    let available_options = []
    let to_user = null

    if (selected_rate_obj) {
        available_options = selected_rate_obj.extras.map(({_id}) => _id)
        to_user = selected_rate_obj.user
    }

    if (form_value.extras) {
        for (let o of form_value.extras) {
            for (let c of store.state.options) {
                if (c._id === o) {
                    total_price = total_price.add(decimal128ToMoney(c.price))
                    break
                }
            }
        }
    }

    return (
        <Form fluid method="put" action="/api/commission" formValue={form_value} model={commission_request_model} ref={ref => (set_form_ref(ref))} onChange={(value => set_form_value(value))}>
            <Grid fluid>
                <Row>
                    <Placeholder type="text" rows={4}/>
                </Row>
                <hr/>
                <h3>{t`Pick your commission`}</h3>
                <CommissionCardRadioGroup/>
                <hr/>
                <Row>
                    <Col xs={24}>
                        <RateOptions options={available_options} checkbox/>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <GuidelineList/>
                </Row>
                <hr/>
                <Row>
                    <Col xs={24}>
                    <h3>{t`Describe your request`}</h3>
                    <FormGroup>
                        <ControlLabel>{t`Title`}:</ControlLabel>
                        <FormControl fluid name="from_title" accepter={Input} type="text" required />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{t`Please describe your request`}:</ControlLabel>
                        <FormControl
                            name="body"
                            componentClass="textarea"
                            rows={3}
                            placeholder={t`Describe your request`}
                            />
                    </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <h3>{t`Attachments`}</h3>
                    <Attachments/>
                </Row>
                <Row>
                    <h3>{t`Terms of Service`}</h3>
                    <Placeholder type="text" rows={4}/>
                    <FormControl name="tos" value="true" accepter={Checkbox}>{t`I have read and agree to the terms of service`}</FormControl>
                </Row>
                <hr/>
                <Row>
                    <Col xs={24}>
                    {!!error && <Message type="error" description={error} />}
                    {!!error && <hr/>}
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}><TotalPriceDisplay>{moneyToString(total_price)}</TotalPriceDisplay></Col>
                    <Col xs={4} xsPush={16}>
                        <Button type="submit" appearance="primary" size="lg" loading={loading} className="commission-button" onClick={async (ev) => {
                            ev.preventDefault()
                            if (form_ref && form_ref.check()) {
                                set_loading(true)
                                set_error(null)
                                let data = {
                                    ...form_value,
                                    extras: form_value.extras.filter(i => available_options.includes(i)),
                                    from_user: from_user._id,
                                    to_user: to_user._id
                                }

                                let r = await commission_store.create_commission(data).then(r => {
                                    set_loading(false)
                                    return r
                                })

                                if (r.status) {
                                    router.push(pages.commission + `/${r.body.data._id}`)
                                } else {
                                    set_error(r.body.error)
                                }
                            }
                        }}>
                            {t`Send request`}
                        </Button>
                    </Col>
                </Row>
            </Grid>
        </Form>
    );
}

export default ProfileCommission;