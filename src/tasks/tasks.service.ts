import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Task } from './tasks.interface';

@Injectable()
export class TasksService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  getAll(): Task[] {
    const taskList: Task[] = [];
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDate().toJSDate().toISOString();
      } catch {
        next = 'error fetching next fire date!';
      }
      taskList.push({
        key,
        next,
      });
    });
    return taskList;
  }

  async deleteTask(id: string): Promise<Task> {
    const job = this.schedulerRegistry.getCronJob(id);
    if (!job) {
      throw new NotFoundException(`Task with ID ${id} does not exist`);
    }
    if (job.isActive) {
      await job.stop();
    }
    const task: Task = {
      key: id,
      next: job.nextDate().toJSDate().toISOString(),
    };
    this.schedulerRegistry.deleteCronJob(id);
    return task;
  }
}
