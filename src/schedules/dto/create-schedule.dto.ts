import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { Max, Min } from 'class-validator';

export class CreateScheduleDTO {
  @IsDate()
  @IsNotEmpty({ message: 'Please define a start date' })
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsString()
  @IsNotEmpty({ message: 'Please define a cron expression' })
  cron_expression: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Please define whether is disabled' })
  disabled: boolean;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsNotEmpty({ message: 'Please define the hour field' })
  hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  @IsNotEmpty({ message: 'Please define the minutes field' })
  minute: number;

  @IsInt()
  @IsNotEmpty({ message: 'Please define a medication id' })
  medicationId: number;
}
