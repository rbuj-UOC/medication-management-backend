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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryFailedError } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.getOne(id);
  }

  @Post()
  async addUser(@Body() userData: CreateUserDTO): Promise<User> {
    try {
      const user = await this.usersService.addUser(userData);
      user.password = undefined; // Remove password from the response
      return user;
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
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateUserDTO,
  ) {
    const user = await this.usersService.updateUser(id, updateData);
    user.password = undefined; // Remove password from the response
    return user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.deleteUser(id);
    user.password = undefined; // Remove password from the response
    return user;
  }
}
