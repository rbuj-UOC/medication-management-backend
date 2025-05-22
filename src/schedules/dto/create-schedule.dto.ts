import { IsDate, IsInt, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDTO {
  @IsDate()
  @IsNotEmpty({ message: 'Please define a time' })
  @ApiProperty({
    type: 'string',
    description: 'Time of the schedule',
    example: '12:45:00',
    nullable: false,
  })
  time: Date;

  @IsDate()
  @IsNotEmpty({ message: 'Please define a start date' })
  @ApiProperty({
    type: 'string',
    description: 'Start date of the schedule',
    example: '2000-10-31T01:30:00.000-05:00',
    nullable: false,
  })
  start_date: Date;

  @IsDate()
  @ApiProperty({
    type: 'string',
    description: 'End date of the schedule',
    example: '2001-07-14T01:30:00.000-05:00',
    nullable: true,
    required: false,
  })
  end_date: Date;

  @IsString()
  @IsNotEmpty({ message: 'Please define a cron expression' })
  @ApiProperty({
    type: 'string',
    description: 'Cron expression for the schedule',
    example: '45 12 * * *',
    nullable: false,
  })
  cron_expression: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a frequency' })
  @ApiProperty({
    type: 'string',
    description: 'Frequency of the schedule',
    example: 'daily',
    enum: ['daily', 'weekly', 'monthly'],
    nullable: false,
  })
  frequency: string;

  @IsInt()
  @IsNotEmpty({ message: 'Please define a medication id' })
  @ApiProperty({
    type: 'number',
    description: 'ID of the medication',
    example: 1,
    nullable: false,
  })
  medication_id: number;
}
