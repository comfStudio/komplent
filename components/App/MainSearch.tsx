import React, { Component } from 'react';

import { Input, InputGroup, Icon } from 'rsuite';

const { Button } = InputGroup

import { t } from '@app/utility/lang'

class MainSearch extends Component {

    render() {
        return (
            <form action="search" method="GET">
                <InputGroup inside className="text-left !w-5/6 !max-w-6xl m-auto">
                    <Input name="q" placeholder={t`What are you looking for?`}/>
                    <Button>
                        <Icon icon="search"></Icon>
                    </Button>
                </InputGroup>
            </form>
        );
    }
}

export default MainSearch;