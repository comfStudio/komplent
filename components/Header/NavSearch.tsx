import React, { Component } from 'react';

import { Menu, Icon, Input } from 'antd';

const {Search} = Input


class NavSearch extends Component {
    render() {
        return (
            <Search size="large" className="text-left w-4/6" />
        );
    }
}

export default NavSearch;