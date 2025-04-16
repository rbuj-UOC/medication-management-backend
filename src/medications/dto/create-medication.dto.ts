import { IsBoolean, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a medication name' })
  @ApiProperty({
    description: 'Name of the medication',
    example: 'Paracetamol 600mg',
    type: 'string',
    required: true,
  })
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Please define whether is disabled' })
  @ApiProperty({
    description: 'Indicates if the medication is disabled',
    example: false,
    type: 'boolean',
    required: false,
  })
  disabled: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Please define a UUID' })
  @ApiProperty({
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    required: true,
  })
  user_id: string;
}
