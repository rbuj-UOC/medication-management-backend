import { IsBoolean, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateMedicationDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a medication name' })
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Please define whether is disabled' })
  disabled: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Please define a UUID' })
  user_id: string;
}
