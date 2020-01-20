import { EventEmitter, DefaultEventMap } from 'tsee'
import { IUser } from '@schema/user';
import log from '@utility/log'

interface FairyProps extends DefaultEventMap {
    user_email_changed: (user: IUser, email: string) => void,
    user_request_expire_deadline_changed: (user: IUser, new_deadline: number) => void,
    user_joined: (user: IUser) => void,
    user_logged_in: (user: IUser) => void,
    user_logged_out: (user: IUser) => void,
}

export let _fairy: EventEmitter<FairyProps> = global?.store?.fairy

export const fairy = () => (global?.store?.fairy as EventEmitter<FairyProps>)

export const configure_fairy = () => {
    log.info("Configured fairy")
    if (!_fairy) {
        _fairy = new EventEmitter<FairyProps>()
        const o_emit = _fairy.emit
        _fairy.emit = (...args) => {log.debug(`Emitted ${args[0]} event`); return o_emit(...args)}
        if (global.store) {
            global.store.fairy = _fairy
        }
    }
}

export default fairy
