import * as tasks from "@server/tasks";
import { ScheduleArgs, ScheduleNowArgs, ScheduleUniqueArgs } from "@server/tasks";
import { fetch } from '@utility/request'
import { array_to_enum, tuple } from "@utility/misc";

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

export async function post_task<T=TaskMethodsType>(method: T, args: (T extends TaskMethodsNowType ? ScheduleNowArgs : (T extends TaskMethodsUniqueType ? ScheduleUniqueArgs : ScheduleArgs))) {
    let r = await fetch("/api/update", {
        method: 'post',
        json: true,
        body: {method, args}
    })
    return r
}