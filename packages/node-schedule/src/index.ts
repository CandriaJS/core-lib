import * as schedule from 'node-schedule'
const { scheduleJob, rescheduleJob, scheduledJobs, cancelJob, gracefulShutdown } = schedule

export {
  schedule as default,
  scheduleJob,
  rescheduleJob,
  scheduledJobs,
  cancelJob,
  gracefulShutdown,
}

export type {
  JobCallback,
  Spec,
  Job,
  Range,
  Recurrence,
  RecurrenceSegment,
  Timezone,
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
  Invocation,
} from 'node-schedule'