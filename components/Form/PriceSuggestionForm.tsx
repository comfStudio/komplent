import React, { useState } from 'react';
import { Form, Schema, FormGroup, ControlLabel, FormControl, InputNumber, Button, Message } from 'rsuite';

import { t } from '@app/utility/lang'
import { get_profile_name, decimal128ToMoneyToString, price_is_null, decimal128ToFloat } from '@utility/misc';

const {
    StringType,
    NumberType,
    BooleanType,
    ArrayType,
    ObjectType,
} = Schema.Types

const model = Schema.Model({
    new_price: NumberType().isRequired('This field is required.')
        .addRule((value, data) => {
            if (value < 0) return false
            return true
        }, t`No negatives allowed`),
})

interface Props {
    user: any
    price: any
    waiting?: boolean
    onAcceptPrice?: Function
    onSuggestPrice?: (price: number) => void
}

const PriceSuggestionForm = (props: Props) => {

    const name = get_profile_name(props.user)
    const [form_value, set_form_value] = useState({} as any)
    const [form_ref, set_form_ref] = useState(null)
    const [accept_loading, set_accept_loading] = useState(false)
    const [suggest_loading, set_suggest_loading] = useState(false)

    return (
        <Form model={model} formValue={form_value} onChange={value => set_form_value(value)} ref={ref => set_form_ref(ref)}>
            {price_is_null(props.price) && <h4>{t`A price for this request needs to be set`}</h4>}
            {!price_is_null(props.price) && <h4>{t`${name} has suggested a price`}</h4>}
            <FormGroup>
            {!price_is_null(props.price) &&
                <h5>{t`Suggested price`}: <span className="text-primary">{decimal128ToMoneyToString(props.price)}</span></h5>
            }
            {props.waiting && <Message type="info" description={t`Waiting for price confirmation`}/>}
            {!props.waiting &&
            <>
                {!price_is_null(props.price) && <Button className="my-2" loading={accept_loading} onClick={(ev) => {ev.preventDefault(); set_accept_loading(true); if (props.onAcceptPrice) props.onAcceptPrice()}} appearance="primary" type="button">{t`Accept suggested price`}</Button>}
                <FormGroup className="mt-4">
                    <ControlLabel>{t`Suggest a new price`}</ControlLabel>
                    <FormControl
                        name="new_price"
                        prefix="$"
                        accepter={InputNumber}
                        type="number"
                    />
                </FormGroup>
                <Button loading={suggest_loading} type="submit" onClick={(ev) => {
                    ev.preventDefault()
                    if (form_ref && form_ref.check()) {
                        if (!price_is_null(props.price) && form_value.new_price === decimal128ToFloat(props.price)) {
                            return
                        }
                        if (props.onSuggestPrice) {
                            set_suggest_loading(true)
                            props.onSuggestPrice(form_value.new_price)
                        }
                    }
                    }}>{t`Suggest new price`}</Button>
            </>}
            </FormGroup>
        </Form>
    );
};

export default PriceSuggestionForm;