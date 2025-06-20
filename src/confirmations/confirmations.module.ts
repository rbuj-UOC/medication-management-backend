import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { ConfirmationsController } from './confirmations.controller';
import { ConfirmationsService } from './confirmations.service';
import { Confirmation } from './entities/confirmations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Confirmation]),
    forwardRef(() => SchedulesModule),
  ],
  providers: [ConfirmationsService],
  controllers: [ConfirmationsController],
  exports: [ConfirmationsService],
})
export class ConfirmationsModule {}
