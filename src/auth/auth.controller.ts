import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';
import { AuthService, Credentials } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'test@test.org',
        },
        password: {
          type: 'string',
          example: 'testtest',
        },
      },
      required: ['username', 'password'],
    },
    description: 'User login credentials',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          example: '10c175fa-b38c-4580-9a99-627e2c37f1d6...',
        },
        user_role: {
          type: 'string',
          example: 'user',
        },
        access_token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2FsaWFzIjoiQ2hlbWEiLCJ1c2VyX2lkIjoiMTBjMTc1ZmEtYjM4Yy00NTgwLTlhOTktNjI3ZTJjMzdmMWQ2IiwidXNlcl9yb2xlIjoidXNlciIsImlhdCI6MTc0NzkxODgzOCwiZXhwIjoxNzQ3OTIyNDM4fQ.jfRMM1Wq9lVJzeS68Rkpi7w45y-cbaiRdFlmI75_3-k',
        },
      },
    },
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 404,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User with email admin@test.org not found',
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

    description: 'No Found',
  })
  login(@Request() req: { user: User }): Credentials {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          example: '10c175fa-b38c-4580-9a99-627e2c37f1d6',
        },
        user_role: {
          type: 'string',
          example: 'user',
        },
        user_alias: {
          type: 'string',
          example: 'johndoe',
        },
      },
    },
    description: 'User profile',
  })
  @ApiResponse({
    status: 401,
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
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}
