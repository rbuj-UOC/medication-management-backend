import {
  IsNotEmpty,
  IsString
} from '@nestjs/class-validator';

export class CreateScheduleDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a cron expression' })
  cron_expression: string;
}
