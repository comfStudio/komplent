
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

const { Column, Cell, HeaderCell } = Table

export const DayLineChart = () => {

    const user = useUser()

    let days = {}
    _.times(31, n => {
        n++
        days[n] = [n.toString(), 0, 0]
    })

    days[2] = ["2", 2,54]
    days[4] = ["4", 87,1]
    days[7] = ["7", 7,9,]

    const [data, set_data] = useState(Object.values(days))

    return (
        <LineChart data={data}>
            <YAxis minInterval={0} axisLabel={value => `${value}`} />
            <Line name="data 1" />
            <Line name="data 2" />
        </LineChart>
    );
};

export const DayTable = () => {

    const [data, set_data] = useState([
        {time: Date(), price: 12.43, rate: "hello", payment_fee: 0.5, platform_fee: 0.8, refunds: 0},
        {time: Date(), price: 12.43, rate: "hello", payment_fee: 0.5, platform_fee: 0.8, refunds: 0},
        {time: Date(), price: 12.43, rate: "hello", payment_fee: 0.5, platform_fee: 0.8, refunds: 0},
        {time: Date(), price: 12.43, rate: "hello", payment_fee: 0.5, platform_fee: 0.8, refunds: 0},
    ])

    return (
        <Table
        virtualized
        autoHeight
        bordered
        data={data}
        >
        <Column flexGrow={2} align="center" fixed>
            <HeaderCell>{t`Time`}</HeaderCell>
            <Cell dataKey="time" />
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
            <HeaderCell>{t`Refunds`}</HeaderCell>
            <Cell dataKey="refunds" />
        </Column>
        </Table>
      );
}

export const MonthBarChart = () => {

    
    const user = useUser()

    let months = {}
    _.times(12, n => {
        n++
        months[n] = [n.toString(), 0, 0]
    })

    months[2] = ["2", 2,54]
    months[4] = ["4", 87,1]
    months[7] = ["7", 7,9,]

    const [data, set_data] = useState(Object.values(months))

    return (
        <BarChart data={data}>
            <YAxis axisLabel={value => `${value}`} minInterval={0} splitLine={false} />
            <Bars name="1" />
            <Bars name="2" />
            <Bars name="3" />
            <Bars name="4" />
            <Bars name="5" />
            <Bars name="6" />
        </BarChart>
    )
}

export const EarningsDaysPieChart = () => {
    
    const user = useUser()

    const [data, set_data] = useState([
        ["1", 19],
        ["2", 964],
        ["3", 544]
    ])

    return (
        <PieChart
            name="Earnings"
            data={data}
            legend={false}
            startAngle={210}
        />
    )
}

export const EarningsMonthBarChart = () => {

    
    const user = useUser()

    let months = {}
    _.times(12, n => {
        n++
        months[n] = [n.toString(), 0]
    })

    months[2] = ["2", 2]
    months[4] = ["4", 87]
    months[7] = ["7", 7]

    const [data, set_data] = useState(Object.values(months))

    return (
        <BarChart data={data}>
            <YAxis axisLabel={value => `$ ${value}`} minInterval={0} splitLine={false} />
            <Bars label={({ value }) => `$ ${(value).toFixed(2)}`}/>
        </BarChart>
    )
}

export const EarningsMonthTable = () => {

    let months = []
    _.times(12, n => {
        n++
        months.push({month: n.toString(), price: 12.43, payment_fee: 0.5, platform_fee: 0.8, refunds: 0})
    })

    const [data, set_data] = useState(Object.values(months))

    return (
        <Table
        virtualized
        autoHeight
        bordered
        data={data}
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
            <HeaderCell>{t`Total Refunds`}</HeaderCell>
            <Cell dataKey="refunds" />
        </Column>
        </Table>
      );
}

export const PayoutHistoryTable = () => {

    let months = []
    _.times(12, n => {
        n++
        months.push({month: n.toString(), fund: 12.43, fee: 0.5})
    })

    const [data, set_data] = useState(Object.values(months))

    return (
        <Table
        virtualized
        autoHeight
        bordered
        data={data}
        >
        <Column flexGrow={1} align="center" fixed>
            <HeaderCell>{t`Month`}</HeaderCell>
            <Cell dataKey="month" />
        </Column>

        <Column flexGrow={2} align="right">
            <HeaderCell>{t`Funds transferred`}</HeaderCell>
            <Cell dataKey="fund" />
        </Column>

        <Column flexGrow={2} align="right">
            <HeaderCell>{t`Fees`}</HeaderCell>
            <Cell dataKey="fee" />
        </Column>
        </Table>
      );
}