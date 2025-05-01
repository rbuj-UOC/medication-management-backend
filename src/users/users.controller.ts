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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { QueryFailedError } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { SelectUserDTO } from './dto/select-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Auth(Role.Admin)
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get('contacts')
  @Auth(Role.User)
  async getUserContacts(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<User[]> {
    return await this.usersService.getUserContacts(user.user_id);
  }

  @Get('push/notifications')
  @Auth(Role.User)
  async fetchPusNotifications(@ActiveUser() user: ActiveUserInterface) {
    await this.usersService.getPushNotifications(user.user_id);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getOne(@ActiveUser() user: ActiveUserInterface): Promise<User> {
    return await this.usersService.getOne(user.user_id);
  }

  @Get('user/:id')
  @Auth(Role.Admin)
  async getOneAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
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

  @Post('contact')
  @Auth(Role.User)
  async addContact(
    @ActiveUser() user: ActiveUserInterface,
    @Body() contactData: SelectUserDTO,
  ) {
    const updatedUser = await this.usersService.addContact(
      user.user_id,
      contactData,
    );
    return updatedUser.contacts;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @ActiveUser() user: ActiveUserInterface,
    @Body() updateData: UpdateUserDTO,
  ) {
    const updatedUser = await this.usersService.updateUser(
      user.user_id,
      updateData,
    );
    updatedUser.password = undefined; // Remove password from the response
    return updatedUser;
  }

  @Put(':id')
  @Auth(Role.Admin)
  async updateUserAdmin(
    @ActiveUser() user: ActiveUserInterface,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateUserDTO,
  ) {
    if (id === user.user_id) {
      throw new BadRequestException(
        'You cannot update your own user data with this endpoint',
      );
    }
    const updatedUser = await this.usersService.updateUser(id, updateData);
    updatedUser.password = undefined; // Remove password from the response
    return updatedUser;
  }

  @Delete()
  @Auth(Role.User)
  async deleteUser(@ActiveUser() user: ActiveUserInterface) {
    const deletedUser = await this.usersService.deleteUser(user.user_id);
    deletedUser.password = undefined; // Remove password from the response
    return deletedUser;
  }

  @Delete('contact')
  @Auth(Role.User)
  async deleteContact(
    @ActiveUser() user: ActiveUserInterface,
    @Body() contactData: SelectUserDTO,
  ) {
    const updatedUser = await this.usersService.deleteContact(
      user.user_id,
      contactData,
    );
    return updatedUser.contacts;
  }

  @Delete('user/:id')
  @Auth(Role.Admin)
  async deleteUserAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    if (user.user_id === id && user.user_role === 'admin') {
      throw new BadRequestException('You cannot delete your own admin account');
    }
    const deletedUser = await this.usersService.deleteUser(id);
    deletedUser.password = undefined; // Remove password from the response
    return deletedUser;
  }
}
