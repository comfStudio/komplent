
import React, { useState } from 'react';
import _ from 'lodash';
import LineChart from "@rsuite/charts/lib/charts/LineChart";
import BarChart from "@rsuite/charts/lib/charts/BarChart";
import PieChart from "@rsuite/charts/lib/charts/PieChart";
import XAxis from "@rsuite/charts/lib/components/XAxis";
import YAxis from "@rsuite/charts/lib/components/YAxis";
import Line from "@rsuite/charts/lib/series/Line";
import Bars from "@rsuite/charts/lib/series/Bars";
import { Table } from 'rsuite';

import { useUser } from '@hooks/user';
import { t } from '@app/utility/lang'
import { useMount } from 'react-use';
import useEarningsStore, { usePayoutStore } from '@store/earnings';
import { format, endOfMonth, getMonth, getDay } from 'date-fns';
import { stringToMoney, moneyToString, stringToMoneyToString, decimal128ToMoneyToString, decimal128ToFloat, floatToMoneyToString } from '@utility/misc';

const { Column, Cell, HeaderCell } = Table

export const CommissionsDayLineChart = () => {

    const store = useEarningsStore()

    const [data, set_data] = useState([])
    const [rates, set_rates] = useState([])
    const [loading, set_loading] = useState(true)

    useMount(() => {
        store.get_day_commission_count_data().then(d => {
            let rates_data = _.uniq(d.map(v => v.rate))
            set_rates(_.uniq(rates_data))

            
            let days = {}
            _.times(endOfMonth(new Date()).getDate(), n => {
                n++
                days[n] = [n.toString(), ..._.times(rates_data.length, _.constant(0))]
            })

            d.forEach(v => {
                days[v.day][rates_data.indexOf(v.rate)+1] = v.count
            })

            set_data(Object.values(days))
            set_loading(false)
        })

    })

    return (
        <LineChart data={data} loading={loading}>
            <XAxis name={t`Day`} data={data.map(v => v[0])}/>
            <YAxis name={t`Count`} minInterval={0} axisLabel={value => `${value}`} />
            {rates.map(v => <Line key={v} name={v}/>)}
        </LineChart>
    );
};

export const CommissionsDayTable = () => {

    const store = useEarningsStore()

    const [data, set_data] = useState([])
    const [loading, set_loading] = useState(true)

    useMount(() => {
        store.get_day_commission_data_per_rate().then(d => {
            set_data(d.map(v => ({
                date: format(new Date(v.date ?? new Date()), 'dd MMM HH:mm:ss'),
                price: decimal128ToMoneyToString(v.price),
                rate: v.rate,
                payment_fee: 0.5,
                platform_fee: 0.8,
                refunded: decimal128ToMoneyToString(v.refunded)})))
            set_loading(false)
        })
    })

    return (
        <Table
        virtualized
        autoHeight
        bordered
        loading={loading}
        data={data}
        >
        <Column flexGrow={2} align="center" fixed>
            <HeaderCell>{t`Time`}</HeaderCell>
            <Cell dataKey="date" />
        </Column>

        <Column flexGrow={3}>
            <HeaderCell>{t`Rate`}</HeaderCell>
            <Cell dataKey="rate" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Price`}</HeaderCell>
            <Cell dataKey="price" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Platform Fee`}</HeaderCell>
            <Cell dataKey="platform_fee" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Payment Processing Fees`}</HeaderCell>
            <Cell dataKey="payment_fee" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Refunded`}</HeaderCell>
            <Cell dataKey="refunded" />
        </Column>
        </Table>
      );
}

export const CommissionsMonthBarChart = () => {
    
    const store = useEarningsStore()

    const [data, set_data] = useState([])
    const [rates, set_rates] = useState([])
    const [loading, set_loading] = useState(true)

    useMount(() => {
        store.get_month_commission_count_data().then(d => {
            let rates_data = _.uniq(d.map(v => v.rate))
            set_rates(_.uniq(rates_data))

            let months = {}
            _.times(12, n => {
                n++
                months[n] = [n.toString(), ..._.times(rates_data.length, _.constant(0))]
            })
            
            d.forEach(v => {
                months[v.month][rates_data.indexOf(v.rate)+1] = v.count
            })

            set_data(Object.values(months))
            set_loading(false)
        })

    })

    return (
        <BarChart data={data} loading={loading}>
            <XAxis name={t`Month`} data={data.map(v => v[0])}/>
            <YAxis name={t`Count`} axisLabel={value => `${value}`} minInterval={0} splitLine={false} />
            {rates.map(v => <Bars key={v} name={v}/>)}
        </BarChart>
    )
}

export const EarningsDaysPieChart = () => {
    
    const store = useEarningsStore()

    const [data, set_data] = useState([])

    const [loading, set_loading] = useState(true)

    useMount(() => {
        store.get_day_commission_earnings_data().then(d => {
            set_data(d.map(v => [v.rate, decimal128ToFloat(v.earned)]))
            set_loading(false)
        })

    })

    return (
        <PieChart
            name="Earnings"
            data={data}
            legend={false}
            loading={loading}
            startAngle={210}
        />
    )
}

export const EarningsMonthBarChart = () => {

    const store = useEarningsStore()

    const [data, set_data] = useState([])
    const [loading, set_loading] = useState(true)

    useMount(() => {
        store.get_month_commission_earnings_data().then(d => {

            let months = {}
            _.times(12, n => {
                n++
                months[n] = [n.toString(), 0]
            })
            
            d.forEach(v => {
                months[v.month][1] = decimal128ToFloat(v.earned)
            })

            set_data(Object.values(months))
            set_loading(false)
        })

    })

    return (
        <BarChart data={data} loading={loading}>
            <YAxis axisLabel={value => `$ ${value}`} minInterval={0} splitLine={false} />
            <Bars label={({ value }) => `$ ${(value).toFixed(2)}`}/>
        </BarChart>
    )
}

export const EarningsMonthTable = () => {

    const store = useEarningsStore()

    const [data, set_data] = useState([])
    const [loading, set_loading] = useState(true)

    useMount(() => {
        store.get_month_commission_data().then(d => {

            set_data(d.map(v => ({
                month: format(new Date(v.date ?? new Date()), 'MMM yyyy'),
                price: decimal128ToMoneyToString(v.price),
                payment_fee: 0.5,
                platform_fee: 0.8,
                refunded: decimal128ToMoneyToString(v.refunded)})))
            set_loading(false)
        })
    })


    return (
        <Table
        virtualized
        autoHeight
        bordered
        data={data}
        loading={loading}
        >
        <Column flexGrow={1} align="center" fixed>
            <HeaderCell>{t`Month`}</HeaderCell>
            <Cell dataKey="month" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Total Price`}</HeaderCell>
            <Cell dataKey="price" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Total Platform Fee`}</HeaderCell>
            <Cell dataKey="platform_fee" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Total Payment Processing Fees`}</HeaderCell>
            <Cell dataKey="payment_fee" />
        </Column>

        <Column flexGrow={1} align="right">
            <HeaderCell>{t`Total Refunded`}</HeaderCell>
            <Cell dataKey="refunded" />
        </Column>
        </Table>
      );
}

export const PayoutHistoryTable = () => {

    const store = usePayoutStore()

    let months = []
    _.times(12, n => {
        n++
        months.push({interval: n.toString(), fund: 12.43, fee: 0.5})
    })

    const data = store.state.payouts.map(v => ({
        interval: `${format(new Date(v.from_date ?? new Date()), 'dd MMM')} - ${format(new Date(v.to_date ?? new Date()), 'dd MMM')}`,
        fund: decimal128ToMoneyToString(v.fund),
        fees: 0,
        status: {
            pending: t`Pending`,
            completed: t`Completed`,
            failed: t`Failed`,
        }[v.status]
    }))

    return (
        <Table
        virtualized
        autoHeight
        bordered
        data={data}
        >
        <Column flexGrow={1} align="center" fixed>
            <HeaderCell>{t`Interval`}</HeaderCell>
            <Cell dataKey="interval" />
        </Column>

        <Column flexGrow={2} align="right">
            <HeaderCell>{t`Funds transferred`}</HeaderCell>
            <Cell dataKey="fund" />
        </Column>

        <Column flexGrow={2} align="right">
            <HeaderCell>{t`Fees`}</HeaderCell>
            <Cell dataKey="fee" />
        </Column>
        <Column flexGrow={1} align="center">
            <HeaderCell>{t`Status`}</HeaderCell>
            <Cell dataKey="status" />
        </Column>
        </Table>
      );
}