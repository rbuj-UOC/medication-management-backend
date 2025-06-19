import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { MedicationsService } from 'src/medications/medications.service';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedules.entity';

@Injectable()
export class SchedulesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly medicationsService: MedicationsService,
    private readonly notificationService: NotificationService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async onApplicationBootstrap() {
    await this.loadTasks();
  }

  async getAll(): Promise<Schedule[]> {
    return await this.scheduleRepository.find();
  }

  async getByMedicationId(id: number): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      where: { medication: { id } },
      order: { time: 'ASC' },
    });
  }

  async getByScheduleId(id: number): Promise<Schedule> {
    return await this.scheduleRepository.findOne({
      where: { id },
    });
  }

  async getScheduleByIdAndUUID(
    schedule_id: number,
    user_id: string,
  ): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      where: {
        id: schedule_id,
        medication: { user: { id: user_id } },
      },
      relations: ['medication', 'medication.user'],
    });
  }

  async getTodayScheduling(userId: string): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      select: {
        id: true,
        start_date: true,
        medication: {
          name: true,
          user: {
            id: true,
          },
        },
      },
      where: {
        medication: { user: { id: userId }, disabled: false },
      },
      relations: ['medication', 'medication.user'],
      order: { time: 'ASC' },
    });
  }

  async addSchedule(scheduleData: CreateScheduleDTO, userId: string) {
    const { frequency, start_date, cron_expression, time, medication_id } =
      scheduleData;
    const medication = await this.medicationsService.getOne(
      medication_id,
      userId,
    );
    if (!medication) {
      throw new NotFoundException(
        `Medication with ID ${scheduleData.medication_id} not found`,
      );
    }
    const schedule = this.scheduleRepository.create({
      frequency,
      time,
      start_date,
      cron_expression,
      medication,
    });
    return await this.scheduleRepository.save(schedule);
  }

  async updateSchedule(id: number, updateData: UpdateScheduleDTO) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    this.scheduleRepository.merge(schedule, updateData);
    return await this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return await this.scheduleRepository.remove(schedule);
  }

  /* Scheduler */

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDate().toJSDate().toISOString();
      } catch {
        next = 'error: next fire date is in the past!';
      }
      console.log(`job: ${key} -> next: ${next}`);
    });
  }

  createTask(schedule: Schedule): void {
    const key = schedule.id.toString();
    const cron_expression = schedule.cron_expression;
    console.log(`createTask: ${key} -> ${cron_expression}`);
    const task = new CronJob(cron_expression, async () => {
      try {
        const scheduledMedication = await this.scheduleRepository.findOne({
          select: {
            id: true,
            start_date: true,
            medication: {
              name: true,
              disabled: true,
              user: {
                device_token: true,
                email: true,
              },
            },
          },
          where: { id: schedule.id },
          relations: ['medication', 'medication.user'],
        });
        if (
          scheduledMedication &&
          scheduledMedication.medication.disabled === false &&
          scheduledMedication.medication.user.device_token
        ) {
          await this.notificationService.sendPush(
            scheduledMedication.medication.user,
            'Medication Reminder',
            `It's time to take ${scheduledMedication.medication.name} at ${scheduledMedication.start_date.getHours()}:${scheduledMedication.start_date.getMinutes()}!`,
          );
        }
      } catch (error) {
        console.error('Error handling scheduled medication:', error);
      }
      console.log(`time (${cron_expression}) for job ${key} to run!`);
    });
    this.schedulerRegistry.addCronJob(key, task);
    task.start();
    this.getCrons();
  }

  async deleteTask(schedule: Schedule): Promise<void> {
    try {
      const key = schedule.id.toString();
      console.log(`deleteTask: ${key}`);
      const task = this.schedulerRegistry.getCronJob(key);
      if (task) {
        await task.stop();
        this.schedulerRegistry.deleteCronJob(key);
      }
      this.getCrons();
    } catch (e) {
      if (e instanceof Error) {
        console.log('Error deleting task:', e.message);
      } else {
        console.log('Error deleting task:', e);
      }
    }
  }

  async loadTasks() {
    const schedules = await this.getAll();
    for (const schedule of schedules) {
      this.createTask(schedule);
    }
  }
}
