import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesModule } from '../schedules/schedules.module';
import { ConfirmationsController } from './confirmations.controller';
import { ConfirmationsService } from './confirmations.service';
import { Confirmation } from './entities/confirmations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Confirmation]), SchedulesModule],
  providers: [ConfirmationsService],
  controllers: [ConfirmationsController],
})
export class ConfirmationsModule {}
