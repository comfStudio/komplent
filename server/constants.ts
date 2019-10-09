import { tuple, array_to_enum } from '@utility/misc'
import { string } from 'prop-types'

export const KEYS = [
    "key1",
    "key2",
    "key3",
]

export const JWT_KEY = 'secret1'

export const JWT_EXPIRATION = 60 * 60 * 24 // 1 day // in seconds

export const COOKIE_AUTH_TOKEN_KEY = '_auth_token'

export const CRYPTO_COST_FACTOR = 12

export enum TaskPriority {
    HIGHEST = 1,
    HIGH = 5,
    MEDIUM = 10,
    LOW = 15,
    LOWEST = 20
}

export type KEYS_TO_TYPE<T> = {
    readonly [P in keyof T]: T[P];
}

export type VALUES_TO_TYPE<T> = {
    readonly [P in keyof T]: P;
}

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

export enum TASK {
    activate_email = 'activate_email', 
    reset_login = 'reset_login', 
    user_commission_status_changed = 'user_commission_status_changed', 
}
export const tasks = array_to_enum(tuple(...Object.keys(TASK).map((v: TASK) => v)));
export type TASK_T = KEYS_TO_TYPE<typeof tasks>

export type TaskDataTypeMap<T> =  (
    T extends TASK.user_commission_status_changed ? { user_id: string, status: boolean } :
    T extends TASK.activate_email ? { user_id: string } :
    T extends TASK.reset_login ? { user_id: string } : never
    )

export const events = tuple(
    'followed_user', 
    'added_product', 
    'recieved_message', 
    'marked_commission_complete', 
    'changed_commission_status', 
    'updated_notice', 
    );

export type EVENTType = typeof events[number]
export const EVENT = array_to_enum(events)