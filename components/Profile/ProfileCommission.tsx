import React, { useState, useRef, useEffect } from 'react'
import {
    Button,
    Panel,
    Row,
    Col,
    Grid,
    Input,
    Form,
    Uploader,
    Icon,
    Toggle,
    Schema,
    FormControl,
    RadioGroup,
    Radio,
    FormGroup,
    Checkbox,
    Message,
    ControlLabel,
    Placeholder,
} from 'rsuite'
import Link from 'next/link'
import qs from 'qs'
import { useRouter } from 'next/router'
import { ButtonProps } from 'rsuite/lib/Button'
import { Cat, Ghost } from 'react-kawaii'
import classnames from 'classnames'

import { t } from '@app/utility/lang'
import { HTMLElementProps, ReactProps } from '@utility/props'

import './ProfileCommission.scss'
import Image from '@components/App/Image'
import { useProfileContext, useProfileUser, useUser } from '@hooks/user'
import { GuidelineList } from '@app/components/Profile'
import {
    useCommissionRateStore,
    useCommissionStore,
} from '@client/store/commission'
import {
    decimal128ToFloat,
    moneyToString,
    stringToMoney,
    decimal128ToMoney,
    decimal128ToMoneyToString,
} from '@utility/misc'
import * as pages from '@utility/pages'
import { make_profile_urlpath } from '@utility/pages'
import { RateOptions } from '@components/Form/CommissionRateForm'
import TextEditor from '@components/App/TextEditor'
import { CenterPanel } from '@components/App/MainLayout'
import { useDatabaseTextToHTML } from '@hooks/db'
import MessageText from '@components/App/MessageText'
import Upload, { UploadProps } from '@components/App/Upload'
import debounce from 'lodash/debounce'

const {
    StringType,
    NumberType,
    BooleanType,
    ArrayType,
    ObjectType,
} = Schema.Types

// returns a new array
const sort_rates_by_price = rates => {
    return [...rates].sort(
        (a, b) => decimal128ToFloat(a.price) - decimal128ToFloat(b.price)
    )
}

interface TotalPriceProps extends ReactProps, HTMLElementProps {}

export const TotalPriceDisplay = (props: TotalPriceProps) => {
    let cls = 'text-xl leading-loose'
    return (
        <span className={classnames('text-xl leading-loose', props.className)}>
            Total Price: <span className="text-primary">{props.children}</span>
        </span>
    )
}

interface CommissionCardProps extends HTMLElementProps {
    data: any
    extras?: any
    selected?: boolean
    noCover?: boolean
}

const CommissionCardHeader = (props: CommissionCardProps) => {
    let { price, title, extras, negotiable, commission_deadline } = props.data
    extras = props.extras || extras

    return (
        <Grid className="header !w-full">
            <Row>
                <Col xs={8}>
                    <span className="price">
                        {price === null ? t`Custom` : decimal128ToMoneyToString(price)}
                    </span>
                </Col>
                <Col xs={16}>
                    <h4 className="title inline-block">{title}</h4>
                </Col>
            </Row>
            {negotiable && (
                <Row>
                    <Col xs={24} className="text-center">
                        <span className="text-primary">{t`Negotiable`}</span>
                    </Col>
                </Row>
            )}
            <Row>
                <Col xs={24} className="text-center">
                    <span className="muted">{t`Delivery ~ ${commission_deadline} days`}</span>
                </Col>
            </Row>
            <Row className="extra-row">
                {extras.map(
                    (
                        {
                            title: extra_title,
                            price: extra_price,
                            _id: extra_id,
                        },
                        index
                    ) => (
                        <Col key={extra_id} xs={24}>
                            <small className="extra">
                                + {decimal128ToMoneyToString(extra_price)} -{' '}
                                {extra_title}
                            </small>
                        </Col>
                    )
                )}
            </Row>
        </Grid>
    )
}

export const CommissionCard = (props: CommissionCardProps) => {
    let image_url
    if (props.data?.image?.paths?.length) {
        image_url = props.data.image.paths[0].url
    }

    return (
        <Panel
            bodyFill
            className={classnames(
                'commission-card mx-auto',
                { selected: props.selected },
                props.className
            )}
            bordered>
            <CommissionCardHeader {...props} />
            {!props.noCover && <Image w="100%" h={250} src={image_url} />}
            {props.selected && <span className="select-box">Selected</span>}
        </Panel>
    )
}

export const CommissionLinkCard = (props: CommissionCardProps) => {
    const user = useUser()
    let c_user = props.data.user
    let url = make_profile_urlpath(c_user)
    if (!user || !c_user || user._id !== c_user._id) {
        url = pages.make_commission_rate_urlpath(c_user, props.data)
    }

    return (
        <Link href={url}>
            <a>
                <CommissionCard {...props} />
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
            {sort_rates_by_price(store.state.rates).map((data, index) => {
                let el = (
                    <Col key={data._id} xs={6}>
                        <label title={data.title}>
                            <FormControl
                                className="mb-2"
                                type="radio"
                                name="commission_rate"
                                value={data._id}
                                defaultChecked={selected_rate === data._id}
                            />
                            <CommissionCard data={data} />
                        </label>
                    </Col>
                )
                return el
            })}
        </Row>
    )
}

interface CommissionTiersRowProps {
    link?: boolean
    onClick?: (data, ev) => void
}

export const CommissionTiersRow = (props: CommissionTiersRowProps) => {
    const store = useCommissionRateStore()
    return (
        <Row gutter={16}>
            {sort_rates_by_price(store.state.rates).map((data, index) => {
                let el = (
                    <Col key={data._id} xs={6}>
                        {props.onClick && (
                            <a href="#" onClick={ev => props.onClick(data, ev)}>
                                <CommissionCard data={data} />
                            </a>
                        )}
                        {props.link && !props.onClick && (
                            <CommissionLinkCard data={data} />
                        )}
                        {!props.link && !props.onClick && (
                            <CommissionCard data={data} />
                        )}
                    </Col>
                )
                return el
            })}
        </Row>
    )
}

const commission_request_model = Schema.Model({
    from_title: StringType().isRequired(t`This field is required.`)
        .addRule((value, data) => {
            if (value.length > 300) return false
            return true
        }, t`Title cannot be longer than 80 characters`),
    commission_rate: StringType().isRequired(t`This field is required.`),
    extras: ArrayType(),
    body: ObjectType().isRequired(t`This field is required.`),
    tos: StringType().isRequired(t`This field is required.`),
})

export const CommissionsClosed = () => {
    return (
        <CenterPanel subtitle={t`Closed for commissions`}>
            <Cat mood="sad" className="emoji" color="rgba(0, 0, 0, 0.5)" />
        </CenterPanel>
    )
}

export const RequestsClosed = () => {
    return (
        <CenterPanel
            subtitle={t`Closed for any more requests, please try later`}>
            <Ghost mood="sad" className="emoji" color="rgba(0, 0, 0, 0.5)" />
        </CenterPanel>
    )
}

export const ProfileCommission = () => {
    const router = useRouter()

    const { profile_user, current_user } = useProfileUser()
    const commission_message_html = useDatabaseTextToHTML(
        profile_user?.commission_request_message
    )

    const selected_rate = router.query.selected || ''

    const from_user = current_user
    const [form_ref, set_form_ref] = useState(null)
    const [form_value, set_form_value] = useState({
        commission_rate: selected_rate || undefined,
    } as any)
    const [error, set_error] = useState(null)
    const [loading, set_loading] = useState(false)

    const commission_store = useCommissionStore()
    const store = useCommissionRateStore()

    const [ file_count, set_file_count ] = useState(0)
    const [ attachments, set_attachments ] = useState({} as any)
    const [ uploading, set_uploading ] = useState(false)
    const [ submit_value, set_submit_value ] = useState()
    const uploader = useRef<any>()

    let selected_rate_obj = null

    let total_price = stringToMoney('0.0')

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
        available_options = selected_rate_obj.extras.map(({ _id }) => _id)
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

    useEffect(() => {
        if (submit_value && !uploading && file_count === Object.keys(attachments).length) {
            set_submit_value(undefined)
            let data = {
                ...submit_value,
                extras: submit_value.extras
                    ? submit_value.extras.filter(i =>
                          available_options.includes(i)
                      )
                    : [],
                from_user: from_user._id,
                to_user: to_user._id,
                rate: submit_value.commission_rate,
                attachments: Object.values(attachments)
            }
    
            commission_store
                .create_commission(data)
                .then(r => {
                    set_loading(false)
                    if (r.status) {
                        router.push(
                            pages.commission +
                                `/${r.body.data._id}`
                        )
                    } else {
                        set_error(r.body.error)
                    }
                    return r
                })
        }
    }, [submit_value, uploading, file_count, attachments])

    const on_upload = debounce((r) => set_uploading(r), 500)

    return (
        <Form
            fluid
            method="put"
            action="/api/commission"
            formValue={form_value}
            model={commission_request_model}
            ref={ref => set_form_ref(ref)}
            onChange={value => set_form_value(value)}>
            <Grid fluid>
                <h3>{t`Pick your commission`}</h3>
                <CommissionCardRadioGroup />
                <hr />
                <Row>
                    <Col xs={24}>
                        <RateOptions options={available_options} checkbox />
                    </Col>
                </Row>
                <Row>
                    <GuidelineList/>
                </Row>
                <hr />
                <Row>
                    {!!!commission_message_html && (
                        <Placeholder.Paragraph rows={8} />
                    )}
                    {!!commission_message_html && (
                        <p
                            dangerouslySetInnerHTML={{
                                __html: commission_message_html,
                            }}
                        />
                    )}
                </Row>
                <hr />
                <Row>
                    <Col xs={24}>
                        <h3>{t`Describe your request`}</h3>
                        <FormGroup>
                            <ControlLabel>{t`Title`}:</ControlLabel>
                            <FormControl
                                fluid
                                name="from_title"
                                accepter={Input}
                                type="text"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>
                                {t`Please describe your request`}:
                            </ControlLabel>
                            <FormControl
                                name="body"
                                accepter={MessageText}
                                maxLength={4000}
                                placeholder={t`Describe your request`}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <h3>{t`Attachments`}</h3>
                    <Upload ref={uploader} type="Attachment" multiple
                    onRemove={f => { 
                        let d = {...attachments}
                        delete d[f.name]
                        set_attachments(d)
                    }}
                    onChange={f => set_file_count(f.length)}
                    onUpload={(r_data, f) => {
                        if (r_data.data) {
                            attachments[f.name] = r_data.data
                        }
                        on_upload(false)
                    }} />
                </Row>
                <Row>
                    <h3>{t`Terms of Service`}</h3>
                    <Placeholder.Paragraph rows={4} />
                    <FormControl
                        name="tos"
                        value="true"
                        accepter={
                            Checkbox
                        }>{t`I have read and agree to the terms of service`}</FormControl>
                </Row>
                <hr />
                <Row>
                    <Col xs={24}>
                        {!!error && (
                            <Message type="error" description={error} />
                        )}
                        {!!error && <hr />}
                    </Col>
                </Row>
                <Row>
                    <Col xs={10}>
                        <TotalPriceDisplay>
                            {moneyToString(total_price)}
                        </TotalPriceDisplay>
                    </Col>
                    <Col xs={4} xsPush={10}>
                        <Button
                            type="submit"
                            appearance="primary"
                            size="lg"
                            loading={loading}
                            className="commission-button"
                            onClick={async ev => {
                                ev.preventDefault()
                                if (form_ref && form_ref.check()) {
                                    set_loading(true)
                                    set_error(null)
                                    if (file_count) {
                                        await uploader.current.start()
                                        set_uploading(true)
                                    }
                                    set_submit_value(form_value)
                                }
                            }}>
                            {t`Send request`}
                        </Button>
                    </Col>
                </Row>
            </Grid>
        </Form>
    )
}

export default ProfileCommission
