import { tuple, array_to_enum } from '@utility/misc'
import { string } from 'prop-types'

export let STATES = global.STATES = global.STATES ? global.STATES : {
    MONGODB_CONNECTED: false,
    ES_SETUP: false,
    SCHEDULER_SETUP: false
}

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
    commission_refund = 'commission_refund',
    commission_deadline = 'commission_deadline',
    commission_phase_updated = 'commission_phase_updated', 
    user_commission_status_changed = 'user_commission_status_changed', 
    user_notice_changed = 'user_notice_changed',
    followed_user = 'followed_user', 
    cdn_upload = 'cdn_upload'
}
export const tasks = array_to_enum(tuple(...Object.keys(TASK).map((v: TASK) => v)));
export type TASK_T = KEYS_TO_TYPE<typeof tasks>

export type TaskDataTypeMap<T> =  (
    T extends TASK.followed_user ? { user_id: string, followee: any } :
    T extends TASK.commission_refund ? { commission: any, phase: any } :
    T extends TASK.commission_deadline ? { to_user_id: string, from_user_id: string, commission: any } :
    T extends TASK.commission_phase_updated ? { user_id: string, commission_id: string, phase: any, from_user_id: string, to_user_id: string } :
    T extends TASK.user_commission_status_changed ? { user_id: string, status: boolean } :
    T extends TASK.user_notice_changed ? { user_id: string, message: string } :
    T extends TASK.activate_email ? { user_id: string } :
    T extends TASK.reset_login ? { user_id: string } :
    T extends TASK.cdn_upload ? { image_id: string } : never
    )

export const user_events = tuple(
    'followed_user', 
    'recieved_message', 
    'changed_commission_status', 
    'notice_changed', 
    );

export const commission_events = tuple(
    'added_product',
    'commission_phase_updated',
    'marked_commission_complete',
    );

export const events = tuple(
    ...user_events,
    ...commission_events
    );

export type EVENTType = typeof events[number]
export const EVENT = array_to_enum(events)

export const STAFF_NAMES = [
    "staff",
    "Staff",
    "STAFF",
]

export const RESERVED_USERNAMES = [
    ...STAFF_NAMES,
    // "twiddly",
    // "Twiddly",
    // "TWIDDLY"
]

export const nsfw_levels = tuple(
    'level_0',  // public
    'level_1', 
    'level_3', 
    );

export type NSFWType = typeof nsfw_levels[number]
export const NSFW_LEVEL = array_to_enum(nsfw_levels)

export const commission_phases = tuple(
    'pending_approval',
    'pending_sketch',
    'revision',
    'pending_payment',
    'pending_product',
    'unlock',
    'complete',
    'cancel',
    'reopen',
    'refund',
    'expire'
    );

export type CommissionPhaseType = typeof commission_phases[number]
export const CommissionPhaseT = array_to_enum(commission_phases)

export const guideline_types = tuple(
    'will_draw',
    'will_not_draw',
    );

export type Guideline = typeof guideline_types[number]
export const GuidelineType = array_to_enum(guideline_types)
