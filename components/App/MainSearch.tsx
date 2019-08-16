import React, { Component } from 'react';

import { Menu, Icon, Input } from 'antd';

const {Search} = Input


class MainSearch extends Component {

    render() {
        return (
            <form action="search" method="GET">
                <Search name="q" size="large" className="text-left !w-4/6" />
            </form>
        );
    }
}

export default MainSearch;