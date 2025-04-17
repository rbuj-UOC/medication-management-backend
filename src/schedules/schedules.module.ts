import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from 'src/medications/entities/medications.entity';
import { MedicationsService } from 'src/medications/medications.service';
import { UsersModule } from 'src/users/users.module';
import { Schedule } from './entities/schedules.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Schedule, Medication])],
  providers: [SchedulesService, MedicationsService],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
