import * as tasks from '@server/tasks'
import {
    ScheduleArgs,
    ScheduleNowArgs,
    ScheduleUniqueArgs,
    get_milli_secs,
} from '@server/tasks'
import { fetch } from '@utility/request'
import { array_to_enum, tuple } from '@utility/misc'
import { TASK } from '@server/constants'
import debounce from 'lodash/debounce'

type TaskMethodsType = keyof typeof tasks
type TaskMethodsNowType = Extract<TaskMethodsType, 'schedule_now'>
type TaskMethodsUniqueType = Extract<TaskMethodsType, 'schedule_unique'>
export const TaskMethods = array_to_enum(
    tuple(...Object.keys(tasks).map((v: TaskMethodsType) => v))
)

export async function post_task<M extends TaskMethodsType, T extends TASK>(
    method: M,
    args: M extends TaskMethodsNowType
        ? ScheduleNowArgs<T>
        : M extends TaskMethodsUniqueType
        ? ScheduleUniqueArgs<T>
        : ScheduleArgs<T>
) {
    let r = await fetch('/api/task', {
        method: 'post',
        json: true,
        body: { method, args },
    })
    return r
}

export const post_task_debounce = debounce(
    post_task,
    get_milli_secs('3 seconds')
)
export const post_task_d_1_secs = debounce(
    post_task,
    get_milli_secs('1 seconds')
)
export const post_task_d_5_secs = debounce(
    post_task,
    get_milli_secs('5 seconds')
)
export const post_task_d_10_secs = debounce(
    post_task,
    get_milli_secs('10 seconds')
)
export const post_task_d_15_secs = debounce(
    post_task,
    get_milli_secs('15 seconds')
)
export const post_task_d_30_secs = debounce(
    post_task,
    get_milli_secs('30 seconds')
)
export const post_task_d_1_min = debounce(post_task, get_milli_secs('1 minute'))
export const post_task_d_3_min = debounce(
    post_task,
    get_milli_secs('3 minutes')
)
export const post_task_d_5_min = debounce(
    post_task,
    get_milli_secs('5 minutes')
)
export const post_task_d_10_min = debounce(
    post_task,
    get_milli_secs('10 minutes')
)
export const post_task_d_15_min = debounce(
    post_task,
    get_milli_secs('15 minutes')
)
export const post_task_d_30_min = debounce(
    post_task,
    get_milli_secs('30 minutes')
)
export const post_task_d_60_min = debounce(
    post_task,
    get_milli_secs('60 minutes')
)
