import human_interval from 'human-interval'
import Bull, { Queue } from 'bull'

import debounce from 'lodash/debounce'

import user from './user'
import { TASK, TaskPriority, TaskDataTypeMap, TASK_T } from '@server/constants';
import log from '@utility/log';

type Scheduler = {
    [K in TASK]: Queue
}

export let scheduler: Scheduler

export const setup_scheduler = async (SCHEDULER_URL) => {
    if (!scheduler) {
        scheduler = {...scheduler, ...user(new Bull("user", SCHEDULER_URL))}
    
    }
}

const get_milli_secs = (when: string) => {
    return human_interval(when) * 1000
}

interface ScheduleOpts {
    priority?: TaskPriority.MEDIUM
    id?: Bull.JobId
}

export interface ScheduleArgs<T = TASK> {
    when: string
    task: T
    data: TaskDataTypeMap<T>
    opts?: ScheduleOpts
}

export const schedule = async ({when, task, data, opts: {priority = TaskPriority.MEDIUM, id} }: ScheduleArgs) => {
    return await scheduler[task].add(task, data, {
        delay: when ? get_milli_secs(when) : undefined,
        priority,
        jobId: id,
    })
}

export interface ScheduleNowArgs extends Omit<ScheduleArgs, "when"> {
}

export const schedule_now = async (args: ScheduleNowArgs) => {
    return await schedule({when: undefined, ...args})
}

export interface ScheduleUniqueArgs extends Omit<ScheduleArgs, "opts"> {
    id: Bull.JobId
    opts: Omit<ScheduleOpts, "id">
}

export const schedule_unique = async ({id, task, opts, ...args}: ScheduleUniqueArgs) => {
    if (id) {
        let prev_job = await scheduler[task].getJob(id)
        if (prev_job) {
            await prev_job.discard()
            await prev_job.remove()
        }
        return await schedule({task, ...args, opts:{id, ...opts}})
    }
}

export const schedule_now_debounce = debounce(schedule_now, get_milli_secs("30 seconds"))
export const schedule_now_d_1_min = debounce(schedule_now, get_milli_secs("1 minute"))
export const schedule_now_d_5_min = debounce(schedule_now, get_milli_secs("5 minutes"))
export const schedule_now_d_10_min = debounce(schedule_now, get_milli_secs("10 minutes"))
export const schedule_now_d_15_min = debounce(schedule_now, get_milli_secs("15 minutes"))
export const schedule_now_d_30_min = debounce(schedule_now, get_milli_secs("30 minutes"))
export const schedule_now_d_60_min = debounce(schedule_now, get_milli_secs("60 minutes"))

export const schedule_debounce = debounce(schedule, get_milli_secs("30 seconds"))
export const schedule_d_1_min = debounce(schedule, get_milli_secs("1 minute"))
export const schedule_d_5_min = debounce(schedule, get_milli_secs("5 minutes"))
export const schedule_d_10_min = debounce(schedule, get_milli_secs("10 minutes"))
export const schedule_d_15_min = debounce(schedule, get_milli_secs("15 minutes"))
export const schedule_d_30_min = debounce(schedule, get_milli_secs("30 minutes"))
export const schedule_d_60_min = debounce(schedule, get_milli_secs("60 minutes"))

export const schedule_unique_debounced = debounce(schedule_unique, get_milli_secs("30 seconds"))
export const schedule_unique_d_1_min = debounce(schedule_unique, get_milli_secs("1 minute"))
export const schedule_unique_d_5_min = debounce(schedule_unique, get_milli_secs("5 minutes"))
export const schedule_unique_d_10_min = debounce(schedule_unique, get_milli_secs("10 minutes"))
export const schedule_unique_d_15_min = debounce(schedule_unique, get_milli_secs("15 minutes"))
export const schedule_unique_d_30_min = debounce(schedule_unique, get_milli_secs("30 minutes"))
export const schedule_unique_d_60_min = debounce(schedule_unique, get_milli_secs("60 minutes"))