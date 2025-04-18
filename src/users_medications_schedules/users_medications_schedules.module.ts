import { Module } from '@nestjs/common';
import { UsersMedicationsSchedulesService } from './users_medications_schedules.service';
import { UsersMedicationsSchedulesController } from './users_medications_schedules.controller';

@Module({
  providers: [UsersMedicationsSchedulesService],
  controllers: [UsersMedicationsSchedulesController]
})
export class UsersMedicationsSchedulesModule {}
