import { IsDate, IsInt, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateScheduleDTO {
  @IsDate()
  @IsNotEmpty({ message: 'Please define a start date' })
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsString()
  @IsNotEmpty({ message: 'Please define a cron expression' })
  cron_expression: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a frequency' })
  frequency: string;

  @IsInt()
  @IsNotEmpty({ message: 'Please define a medication id' })
  medication_id: number;
}
