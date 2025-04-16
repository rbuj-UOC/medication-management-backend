import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Schedule } from '../entities/schedules.entity';
import { SchedulesService } from '../schedules.service';

@EventSubscriber()
export class SchedulesSubscriber
  implements EntitySubscriberInterface<Schedule>
{
  constructor(
    dataSource: DataSource,
    private schedulesService: SchedulesService,
  ) {
    dataSource.subscribers.push(this);
  }

  /**
   * Indicates that this subscriber only listen to Schedule events.
   */
  listenTo() {
    return Schedule;
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<Schedule>) {
    try {
      if (event && event.entity) {
        this.schedulesService.createTask(event.entity);
      }
    } catch (e) {
      console.log('Error afterInsert:', e);
    }
  }

  /**
   * Called before entity update.
   */
  async beforeUpdate(event: UpdateEvent<Schedule>) {
    try {
      const schedule = event.entity as Schedule | undefined;
      if (schedule) {
        await this.schedulesService.deleteTask(schedule);
      }
    } catch (e) {
      console.log('Error beforeUpdate:', e);
    }
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<Schedule>) {
    try {
      const schedule = event.entity as Schedule | undefined;
      if (schedule) {
        this.schedulesService.createTask(schedule);
      }
    } catch (e) {
      console.log('Error afterUpdate:', e);
    }
  }

  /**
   * Called before entity removal.
   */
  async beforeRemove(event: RemoveEvent<Schedule>) {
    try {
      if (event && event.entity) {
        await this.schedulesService.deleteTask(event.entity);
      }
    } catch (e) {
      console.log('Error beforeRemove:', e);
    }
  }
}
