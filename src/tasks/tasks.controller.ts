import { Controller, Delete, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { TasksService } from './tasks.service';

@ApiBearerAuth()
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
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get all tasks (Admin)' })
  @ApiOkResponse({
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

  @Delete(':id')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Delete task by ID (Admin)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Task ID',
    type: 'string',
    example: '1',
  })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        next: { type: 'string' },
      },
      example: {
        key: '1',
        next: '2025-05-22T22:00:00.000Z',
      },
    },
  })
  @ApiFoundResponse({
    description: 'Task not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Task with ID 1 does not exist' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async deleteTask(@Param('id') id: string) {
    return await this.tasksService.deleteTask(id);
  }
}
