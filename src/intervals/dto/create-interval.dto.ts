import {
  IsNotEmpty,
  IsString
} from '@nestjs/class-validator';

export class CreateIntervalDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a cron expression' })
  cron_expression: string;
}
