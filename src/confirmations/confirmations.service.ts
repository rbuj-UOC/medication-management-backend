import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedules/entities/schedules.entity';
import { SchedulesService } from 'src/schedules/schedules.service';
import { Repository } from 'typeorm';
import { ConfirmationDTO } from './dto/confirmation.dto';
import { CreateConfirmationDTO } from './dto/create-confirmation.dto';
import { Confirmation } from './entities/confirmations.entity';

@Injectable()
export class ConfirmationsService {
  constructor(
    @InjectRepository(Confirmation)
    private confirmationRepository: Repository<Confirmation>,
    @Inject(forwardRef(() => SchedulesService))
    private readonly schedulesService: SchedulesService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async confirm(
    confirmationData: CreateConfirmationDTO,
    user_id: string,
  ): Promise<Confirmation> {
    let notificationDate: Date;
    const schedule = await this.schedulesService.getScheduleByIdAndUUID(
      confirmationData.schedule_id,
      user_id,
    );
    // Check if the schedule exists and if the medication is not disabled
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    if (schedule.medication.disabled) {
      throw new NotFoundException('Medication is disabled');
    }
    // Check if the schedule has a cron job registered
    const cronJob = this.schedulerRegistry.getCronJob(schedule.id.toString());
    if (!cronJob) {
      throw new NotFoundException('Cron job not found for this schedule');
    }
    // Determine the notification date based on the cron job's execution times
    const currentDate = new Date();
    const nextDate = cronJob.nextDate().toJSDate();
    const lastDate = cronJob.lastExecution;
    if (!lastDate) {
      notificationDate = nextDate;
    } else {
      const currentDateTime = currentDate.getTime();
      const nextDateTime = nextDate.getTime();
      const lastDateTime = lastDate.getTime();
      const nextDateTimeDiff = Math.abs(nextDateTime - currentDateTime);
      const lastDateTimeDiff = Math.abs(lastDateTime - currentDateTime);
      if (lastDateTimeDiff < nextDateTimeDiff) {
        notificationDate = lastDate;
      } else {
        notificationDate = nextDate;
      }
    }
    // Check if a confirmation already exists for this schedule and notification date
    const confirmation = await this.getConfirmationByScheduleIdAndDate(
      schedule.id,
      notificationDate,
    );
    if (confirmation) {
      confirmation.confirmed = confirmationData.confirmed;
      return this.confirmationRepository.save(confirmation);
    }
    // If no confirmation exists, create a new one
    return this.createConfirmation(
      confirmationData.confirmed,
      schedule,
      notificationDate,
    );
  }

  async createConfirmation(
    confirmed: boolean,
    schedule: Schedule,
    notification_at: Date,
  ) {
    const newConfirmation = this.confirmationRepository.create({
      confirmed,
      schedule,
      notification_at,
    });
    return this.confirmationRepository.save(newConfirmation);
  }

  async getConfirmationByScheduleIdAndDate(
    id: number,
    notification_at: Date,
  ): Promise<Confirmation | null> {
    return this.confirmationRepository.findOne({
      where: {
        schedule: { id },
        notification_at,
      },
    });
  }

  getConfirmationHistory(user_id: string): Promise<ConfirmationDTO[]> {
    return this.confirmationRepository
      .createQueryBuilder('c')
      .select(['c.notification_at', 'm.name', 's.time', 'c.confirmed'])
      .innerJoin('c.schedule', 's')
      .innerJoin('s.medication', 'm')
      .where('m.user.id = :user_id', { user_id })
      .orderBy('c.notification_at', 'ASC')
      .getMany()
      .then((confirmations) => {
        return confirmations.map((confirmation) => {
          return {
            notification_at: confirmation.notification_at,
            name: confirmation.schedule.medication.name,
            time: confirmation.schedule.time,
            confirmed: confirmation.confirmed,
          } as ConfirmationDTO;
        });
      });
  }
}
