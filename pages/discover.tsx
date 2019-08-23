import React, { Component } from 'react';

import MainLayout from '@components/App/MainLayout'
import DiscoverLayout from '@components/Discover/DiscoverLayout'

class DiscoverPage extends Component {
    render() {
        return (
            <MainLayout activeKey="discover">
                <DiscoverLayout/>
            </MainLayout>
        );
    }
}

export default DiscoverPage;