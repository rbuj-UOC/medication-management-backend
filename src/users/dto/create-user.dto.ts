import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a name' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a surname_1' })
  surname_1: string;

  @IsString()
  surname_2: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define an alias' })
  alias: string;

  @IsDate()
  @IsNotEmpty({ message: 'Please define a birth date' })
  birth_date: Date;

  @IsEmail()
  @IsNotEmpty({ message: 'Please define an email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a password' })
  password: string;

  @IsEnum(Role)
  @IsNotEmpty({ message: 'Please define a role' })
  role: Role;
}
