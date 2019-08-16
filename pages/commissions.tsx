import React, { Component } from 'react';

import MainLayout from '@components/App/MainLayout'

class CommissionsPage extends Component {
    render() {
        return (
            <MainLayout selectedKeys={["commissions"]}>
            </MainLayout>
        );
    }
}

export default CommissionsPage;