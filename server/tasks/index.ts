import human_interval from 'human-interval'
import Bull, { Queue } from 'bull'

import debounce from 'lodash/debounce'

import user from './user'
import { TASK, TaskPriority, TaskDataTypeMap } from '@server/constants';
import log from '@utility/log';

type Scheduler = {
    [K in TASK]: Queue
}

export let scheduler: Scheduler = global.store ? global.store.scheduler : undefined

export const setup_scheduler = async (SCHEDULER_URL) => {
    if (!scheduler) {
        scheduler = global.store.scheduler = {...user(new Bull("user", SCHEDULER_URL))}
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

export const get_id = (task: TASK, key) => key ? task + '_' + key : key

export async function schedule<T extends TASK>({when, task, data, opts: {priority = TaskPriority.MEDIUM, key} = {} }: ScheduleArgs<T>) {
    let delay = when ? get_milli_secs(when) : undefined
    log.debug(`Adding task ${task} with delay ${delay} (${when}) and data ${JSON.stringify(data, null, 4)}`)
    return await scheduler[task].add(task, data, {
        delay,
        priority,
        jobId: get_id(task, key),
    })
}

export interface ScheduleNowArgs<T extends TASK> extends Omit<ScheduleArgs<T>, "when"> {
}

export async function schedule_now<T extends TASK>(args: ScheduleNowArgs<T>) {
    return await schedule({when: undefined, ...args})
}

export interface ScheduleUniqueArgs<T extends TASK> extends Omit<ScheduleArgs<T>, "opts"> {
    key: Bull.JobId
    opts?: Omit<ScheduleOpts, "key">
}

export async function  schedule_unique<T extends TASK>({key, task, opts, ...args}: ScheduleUniqueArgs<T>) {
    if (key) {
        let prev_job = await scheduler[task].getJob(get_id(task, key))
        if (prev_job) {
            await prev_job.discard()
            await prev_job.remove()
        }
        return await schedule({task, ...args, opts:{key, ...opts}})
    }
}