import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from 'src/medications/entities/medications.entity';
import { MedicationsService } from 'src/medications/medications.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';
import { Schedule } from './entities/schedules.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { SchedulesSubscriber } from './subscriber/schedules.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Medication]),
    UsersModule,
    NotificationModule,
  ],
  providers: [SchedulesService, MedicationsService, SchedulesSubscriber],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
