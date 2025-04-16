import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('getAll')
  @Auth(Role.Admin)
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get('getOne/:id')
  @Auth(Role.Admin)
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.getOne(id);
  }

  @Post('create')
  async addUser(@Body() userData: CreateUserDTO) {
    try {
      await this.usersService.addUser(userData);
    } catch (e) {
      let message = 'User could not be created';
      if (
        e &&
        e instanceof QueryFailedError &&
        typeof e.driverError === 'object' &&
        'detail' in e.driverError &&
        typeof e.driverError.detail === 'string'
      ) {
        message = e.driverError.detail;
      }
      throw new BadRequestException(message);
    }
    return 'User created successfully';
  }

  @Put('update/:id')
  @Auth(Role.User)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateUserDTO,
  ) {
    await this.usersService.updateUser(id, updateData);
    return 'User updated successfully';
  }

  @Delete('delete/:id')
  @Auth(Role.User)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.deleteUser(id);
    return 'User deleted successfully';
  }
}