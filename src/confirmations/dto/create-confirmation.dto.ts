import { IsBoolean, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConfirmationDTO {
  @IsBoolean()
  @IsNotEmpty({ message: 'Please define whether is confirmed' })
  @ApiProperty({
    description: 'Indicates if the schedule is confirmed',
    example: false,
    type: 'boolean',
    required: false,
  })
  confirmed: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Please define a schedule id' })
  @ApiProperty({
    description: 'UD of the schedule',
    example: '12345',
    type: 'number',
    required: true,
  })
  schedule_id: number;
}
