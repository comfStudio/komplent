import React, { Component } from 'react';
import { ReactProps } from '@utility/props';

const DefaultOnSSR = () => (<span></span>);

interface Props extends ReactProps {
    onSSR?: React.ReactNode
}

class NoSSR extends Component<Props, { canRender: boolean }> {

    static defaultProps = {
        onSSR: <DefaultOnSSR/>
    }

    constructor(props) {
        super(props);

        this.state = {
        canRender: false
        };

    }

    componentDidMount() {
        this.setState({canRender: true});
    }

    render() {
        const { children, onSSR } = this.props;
        const { canRender } = this.state;

        return canRender ? children : onSSR;
    }

}

export default NoSSR;