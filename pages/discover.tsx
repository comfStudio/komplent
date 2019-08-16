import React, { Component } from 'react';

import MainLayout from '@components/App/MainLayout'

class DiscoverPage extends Component {
    render() {
        return (
            <MainLayout selectedKeys={["discover"]}>
            </MainLayout>
        );
    }
}

export default DiscoverPage;