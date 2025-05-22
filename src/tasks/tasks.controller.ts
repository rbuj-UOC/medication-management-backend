import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { TasksService } from './tasks.service';

@ApiBearerAuth()
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
  },
  description: 'Unauthorized',
})
@ApiResponse({
  status: 403,
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
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get all tasks (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'All tasks',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          next: { type: 'string' },
        },
      },
      example: [
        {
          key: '1',
          next: '2025-05-22T22:00:00.000Z',
        },
        {
          key: '2',
          next: '2025-05-22T22:20:00.000Z',
        },
      ],
    },
    isArray: true,
  })
  getTasks() {
    return this.tasksService.getAll();
  }
}
