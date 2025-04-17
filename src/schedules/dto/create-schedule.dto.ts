import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';

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
  @IsNotEmpty({ message: 'Please define a medication id' })
  medicationId: number;
}
