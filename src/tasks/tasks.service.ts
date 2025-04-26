import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Tasks } from './tasks.interface';

@Injectable()
export class TasksService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  getAll(): Tasks[] {
    const taskList: Tasks[] = [];
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDate().toJSDate().toISOString();
      } catch (e) {
        next = 'error fetching next fire date!';
      }
      taskList.push({
        key,
        next,
      });
    });
    return taskList;
  }
}
