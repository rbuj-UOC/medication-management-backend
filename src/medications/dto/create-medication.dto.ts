import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateMedicationDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a medication name' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a UUID' })
  userId: string;
}
