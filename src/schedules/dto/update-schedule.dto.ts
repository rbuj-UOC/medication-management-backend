import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDTO } from './create-schedule.dto';

export class UpdateScheduleDTO extends PartialType(CreateScheduleDTO) {}
