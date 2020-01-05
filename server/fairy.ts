import { EventEmitter, DefaultEventMap } from 'tsee'
import { IUser } from '@schema/user';

interface FairyProps extends DefaultEventMap {
    user_email_changed: (user: IUser, email: string) => void,
    user_joined: (user: IUser) => void,
}

export let fairy: EventEmitter<FairyProps> = global.store
    ? global.store.fairy
    : new EventEmitter<FairyProps>();

export default fairy