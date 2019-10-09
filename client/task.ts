import * as tasks from "@server/tasks";
import { ScheduleArgs, ScheduleNowArgs, ScheduleUniqueArgs } from "@server/tasks";
import { fetch } from '@utility/request'
import { array_to_enum, tuple } from "@utility/misc";
import { TASK } from "@server/constants";

type TaskMethodsType = keyof typeof tasks
type TaskMethodsNowType = Extract<TaskMethodsType,
    "schedule_now"
    |"schedule_now_d_1_min"
    |"schedule_now_d_5_min"
    |"schedule_now_d_10_min"
    |"schedule_now_d_15_min"
    |"schedule_now_d_30_min"
    |"schedule_now_d_60_min">
type TaskMethodsUniqueType = Extract<TaskMethodsType,
    "schedule_unique"
    |"schedule_unique_d_1_min"
    |"schedule_unique_d_5_min"
    |"schedule_unique_d_10_min"
    |"schedule_unique_d_15_min"
    |"schedule_unique_d_30_min"
    |"schedule_unique_d_60_min">
export const TaskMethods = array_to_enum(tuple(...Object.keys(tasks).map((v: TaskMethodsType) => v)))

export async function post_task<M extends TaskMethodsType, T extends TASK>(method: M, args: (M extends TaskMethodsNowType ? ScheduleNowArgs<T> : (M extends TaskMethodsUniqueType ? ScheduleUniqueArgs<T> : ScheduleArgs<T>))) {
    let r = await fetch("/api/task", {
        method: 'post',
        json: true,
        body: {method, args}
    })
    return r
}