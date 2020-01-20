import human_interval from 'human-interval'
import Bull, { Queue } from 'bull'

import user_tasks from './user'
import commission_tasks from './commission'
import cdn_tasks from './cdn'
import monetary_tasks from './monetary'
import { TASK, TaskPriority, TaskDataTypeMap, STATES } from '@server/constants'
import log from '@utility/log'

type Scheduler = {
    [K in TASK]: Queue
}

export let scheduler: Scheduler = global.store
    ? global.store.scheduler
    : undefined

export const setup_scheduler = async SCHEDULER_URL => {
    if (!scheduler && SCHEDULER_URL) {
        scheduler = global.store.scheduler = {
            ...user_tasks(new Bull('user', SCHEDULER_URL)),
            ...commission_tasks(new Bull('commission', SCHEDULER_URL)),
            ...cdn_tasks(new Bull('cdn', SCHEDULER_URL)),
            ...monetary_tasks(new Bull('monetary', SCHEDULER_URL)),
        }
    }
    if (scheduler) {
        STATES.SCHEDULER_SETUP = true
    }
}

export const get_milli_secs = (when: string) => {
    return human_interval(when)
}

interface ScheduleOpts {
    priority?: TaskPriority.MEDIUM
    key?: Bull.JobId
}

export interface ScheduleArgs<T extends TASK> {
    when: string
    task: T
    data: TaskDataTypeMap<T>
    opts?: ScheduleOpts
}

export const get_id = (task: TASK, key) => (key ? task + '_' + key : key)

export async function schedule<T extends TASK>({
    when,
    task,
    data,
    opts: { priority = TaskPriority.MEDIUM, key } = {},
}: ScheduleArgs<T>) {
    if (!STATES.SCHEDULER_SETUP) return
    let delay = when ? get_milli_secs(when) : undefined
    log.debug(
        `Adding task ${task} with delay ${delay} (${when ?? 'now'}) and data ${JSON.stringify(
            data,
            null,
            4
        )}`
    )
    return await scheduler[task].add(task, data, {
        delay,
        priority,
        jobId: get_id(task, key),
    })
}

export interface ScheduleNowArgs<T extends TASK>
    extends Omit<ScheduleArgs<T>, 'when'> {}

export async function schedule_now<T extends TASK>(args: ScheduleNowArgs<T>) {
    return await schedule({ when: undefined, ...args })
}

export async function remove_unique_task<T extends TASK>(task: T, key: Bull.JobId) {
    let job = await scheduler[task].getJob(get_id(task, key))
    if (job) {
        await job.discard()
        await job.remove()
        return true
    }
    return false
}

export interface ScheduleUniqueArgs<T extends TASK>
    extends Omit<ScheduleArgs<T>, 'opts'> {
    key: Bull.JobId
    opts?: Omit<ScheduleOpts, 'key'>
}

export async function schedule_unique<T extends TASK>({
    key,
    task,
    opts,
    ...args
}: ScheduleUniqueArgs<T>) {
    if (key && STATES.SCHEDULER_SETUP) {
        await remove_unique_task(task, key)
        return await schedule({ task, ...args, opts: { key, ...opts } })
    }
}

export interface ScheduleUniqueNowArgs<T extends TASK>
    extends Omit<ScheduleUniqueArgs<T>, 'when'> {}


export async function schedule_unique_now<T extends TASK>(args: ScheduleUniqueNowArgs<T>) {
    return await schedule_unique({ when: undefined, ...args })
}
