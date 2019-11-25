import { HTMLElementProps } from '@app/utility/props'

interface Props extends HTMLElementProps {}

export const H1 = props => {
    let cls = '.heading'
    return (
        <h1
            className={props.className ? props.className + ' ' + cls : cls}
            {...props}
        />
    )
}
