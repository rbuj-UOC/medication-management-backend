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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get all users (Admin)' })
  @ApiOkResponse({
    description: 'All users',
    type: User,
    example: [
      {
        id: '38297b2b-5fa0-4dc6-b41a-59fcf2eeccca',
        name: 'Jose Maria',
        surname_1: 'Collado',
        surname_2: 'López',
        alias: 'Chema',
        birth_date: '2025-05-22T16:30:57.746Z',
        email: 'patient@test.org',
        role: 'user',
        device_token:
          'fMBpys9DbWvsLoARxJFiv1:APA91bFGRiQEEIpFPZcD0P2M7Hvpmw8AXbrbihyWMrzyP1FX6hekLmNmuXP-YyKYfrQyMBYgUMl9qG05oBWQvPtzNpkzH8km-mOI5dLOpUfAdffKPJG6kY4',
        created_at: '2025-05-22T13:32:10.320Z',
        updated_at: '2025-05-22T13:32:10.320Z',
      },
      {
        id: '8d255932-84c6-49ab-8ab1-fdef7b38c89c',
        name: 'Maria Isabel',
        surname_1: 'Gracia',
        surname_2: 'Baena',
        alias: 'Isa',
        birth_date: '1960-11-11T00:00:00.000Z',
        email: 'admin@test.org',
        role: 'admin',
        device_token: null,
        created_at: '2025-05-22T13:49:54.602Z',
        updated_at: '2025-05-22T13:49:54.602Z',
      },
    ],
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiBearerAuth()
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get('contacts')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get user contacts' })
  @ApiOkResponse({
    description: 'User contacts',
    type: User,
    example: [
      {
        id: 'f3dee6a1-47e0-4da6-8345-785c79393584',
        name: 'Ariadna',
        surname_1: 'Galvan',
        surname_2: 'Mejia',
        alias: 'Ariadna',
        birth_date: '1960-11-11T00:00:00.000Z',
        email: 'contact@test.org',
        role: 'user',
        device_token: null,
        created_at: '2025-05-22T16:43:33.379Z',
        updated_at: '2025-05-22T16:43:33.379Z',
      },
    ],
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
      description: 'Unauthorized',
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiBearerAuth()
  async getUserContacts(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<User[]> {
    return await this.usersService.getUserContacts(user.user_id);
  }

  @Get('push/notifications')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get push notifications' })
  @ApiOkResponse({
    description: 'Push notifications',
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiBearerAuth()
  async fetchPusNotifications(@ActiveUser() user: ActiveUserInterface) {
    await this.usersService.getPushNotifications(user.user_id);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({
    description: 'User profile',
    type: User,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
  async getOne(@ActiveUser() user: ActiveUserInterface): Promise<User> {
    return await this.usersService.getOne(user.user_id);
  }

  @Get('user/:id')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get user by ID (Admin)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User by ID (Admin)',
    type: User,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (uuid is expected)',
        },
        error: {
          type: 'string',
          example: 'Bad request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
    },
    description: 'id is not a valid UUID',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
  async getOneAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    type: CreateUserDTO,
    description: 'User data',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Key (email)=(patient@test.org) already exists.',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
      description: 'Bad Request',
    },
  })
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
        e.driverError !== null &&
        'detail' in e.driverError &&
        typeof (e.driverError as { detail?: unknown }).detail === 'string'
      ) {
        message = (e.driverError as { detail: string }).detail;
      }
      throw new BadRequestException(message);
    }
  }

  @Post('contact')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Add user contact' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'rwst@test.org',
        },
      },
    },
    description: 'User contact data',
    required: true,
  })
  @ApiOkResponse({
    type: User,
    description: 'User contact',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'You cannot add yourself as a contact',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
      description: 'Bad Request',
    },
    description: 'You cannot add yourself as a contact',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: '12341234',
        },
      },
    },
    description: 'User fields to update',
    required: true,
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: User,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Update user by ID (Admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: '12341234',
        },
      },
    },
    description: 'User fields to update',
    required: true,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User updated successfully (Admin)',
    type: User,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (uuid is expected)',
        },
        error: {
          type: 'string',
          example: 'Bad request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
      description: 'Bad request',
    },
    description: 'id is not a valid UUID',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: User,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
  async deleteUser(@ActiveUser() user: ActiveUserInterface) {
    const deletedUser = await this.usersService.deleteUser(user.user_id);
    deletedUser.password = undefined; // Remove password from the response
    return deletedUser;
  }

  @Delete('contact')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Delete user contact' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'contact@test.org',
        },
      },
    },
    description: 'User contact data',
    required: true,
  })
  @ApiOkResponse({
    description: 'User contact deleted successfully',
    type: User,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Contact with email contact@test.org not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'Contact not found',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Delete user by ID (Admin)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User deleted successfully (Admin)',
    type: User,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (uuid is expected)',
        },
        error: {
          type: 'string',
          example: 'Bad request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
      description: 'Bad request',
    },
    description: 'id is not a valid UUID',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Forbidden resource',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    description: 'Forbidden resource',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
    description: 'User not found',
  })
  @ApiBearerAuth()
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
