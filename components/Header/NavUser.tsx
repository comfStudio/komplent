import React from 'react';
import { Icon, Nav } from 'rsuite';

interface Props {
}

const NavUser = (props: Props) => {

    return (
        (<Nav.Item key="login" id="nav-user" {...props}>
            <Icon icon="user" size="2x" />
        </Nav.Item>)
    );
};

export default NavUser;