import { IsString } from '@nestjs/class-validator';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a user name' })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Please define an email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a password' })
  password: string;

  @IsEnum(Role)
  @IsNotEmpty({ message: 'Please define a role' })
  role: Role
}