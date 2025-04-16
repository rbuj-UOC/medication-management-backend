import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Please define a name' })
  @ApiProperty({
    type: 'string',
    description: 'Name of the user',
    example: 'John',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a surname_1' })
  @ApiProperty({
    type: 'string',
    description: 'First surname of the user',
    example: 'Doe',
    required: true,
  })
  surname_1: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Second surname of the user',
    example: 'Smith',
    required: false,
  })
  surname_2: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define an alias' })
  @ApiProperty({
    type: 'string',
    description: 'Alias of the user',
    example: 'johndoe',
    required: true,
  })
  alias: string;

  @IsDate()
  @IsNotEmpty({ message: 'Please define a birth date' })
  @ApiProperty({
    type: Date,
    description: 'Birth date of the user',
    example: '1990-01-01',
    required: true,
  })
  birth_date: Date;

  @IsEmail()
  @IsNotEmpty({ message: 'Please define an email' })
  @ApiProperty({
    type: 'string',
    description: 'Email of the user',
    example: 'test@test.org',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please define a password' })
  @ApiProperty({
    type: 'string',
    description: 'Password of the user',
    example: 'testtest',
    required: true,
  })
  password: string;

  @IsEnum(Role)
  @IsNotEmpty({ message: 'Please define a role' })
  @ApiProperty({
    type: 'string',
    description: 'Role of the user',
    example: Role.User,
    enum: Role,
    required: true,
  })
  role: Role;
}
