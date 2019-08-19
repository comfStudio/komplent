import React from 'react';
import { Avatar, Badge } from 'rsuite';

const NavUser = () => {
    return (
        <Badge count={1}>
            <Avatar icon="user" size="large" shape="square"/>
        </Badge>
    );
};

export default NavUser;