import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulesService } from 'src/schedules/schedules.service';
import { Repository } from 'typeorm';
import { CreateConfirmationDTO } from './dto/create-confirmation.dto';
import { Confirmation } from './entities/confirmations.entity';

@Injectable()
export class ConfirmationsService {
  constructor(
    @InjectRepository(Confirmation)
    private confirmationRepository: Repository<Confirmation>,
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
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    if (schedule.medication.disabled) {
      throw new NotFoundException('Medication is disabled');
    }

    const cronJob = this.schedulerRegistry.getCronJob(schedule.id.toString());
    if (!cronJob) {
      throw new NotFoundException('Cron job not found for this schedule');
    }

    const nextDate = cronJob.nextDate().toJSDate();
    const lastDate = cronJob.lastDate();
    const currentDate = new Date();
    if (lastDate > currentDate) {
      notificationDate = lastDate;
    } else {
      notificationDate = nextDate;
    }

    const confirmation = await this.confirmationRepository.findOne({
      where: {
        schedule: {
          id: confirmationData.schedule_id,
        },
        notification_at: notificationDate,
      },
    });
    if (confirmation) {
      confirmation.confirmed = confirmationData.confirmed;
      return this.confirmationRepository.save(confirmation);
    }
    const newConfirmation = this.confirmationRepository.create({
      confirmed: confirmationData.confirmed,
      schedule: schedule,
      notification_at: notificationDate,
    });
    return this.confirmationRepository.save(newConfirmation);
  }
}
