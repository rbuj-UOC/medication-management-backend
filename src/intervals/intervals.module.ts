import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interval } from './entities/intervals.entity';
import { IntervalsController } from './intervals.controller';
import { IntervalsService } from './intervals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interval])],
  providers: [IntervalsService],
  controllers: [IntervalsController],
})
export class IntervalsModule { }
