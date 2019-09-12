import React, { Component } from 'react';

import MainLayout from '@components/App/MainLayout'
import DiscoverLayout from '@components/Discover/DiscoverLayout'

const DiscoverPage = () => {
    return (
        <MainLayout activeKey="discover">
            <DiscoverLayout/>
        </MainLayout>
    );
}

export default DiscoverPage;