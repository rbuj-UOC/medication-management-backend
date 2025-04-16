import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { QueryFailedError } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedules.entity';
import { SchedulesService } from './schedules.service';

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
@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get all schedules (Admin)' })
  @ApiOkResponse({
    type: Schedule,
    example: [
      {
        id: 1,
        start_date: '2025-05-21T22:00:00.000Z',
        end_date: null,
        time: '00:00:00',
        frequency: 'daily',
        cron_expression: '0 0 * * *',
        created_at: '2025-05-22T16:31:11.800Z',
        updated_at: '2025-05-22T16:31:11.800Z',
      },
      {
        id: 2,
        start_date: '2025-05-21T22:20:00.000Z',
        end_date: null,
        time: '00:20:00',
        frequency: 'daily',
        cron_expression: '20 0 * * *',
        created_at: '2025-05-22T16:31:19.797Z',
        updated_at: '2025-05-22T16:31:19.797Z',
      },
    ],
    description: 'All schedules',
    isArray: true,
  })
  async getAll(): Promise<Schedule[]> {
    return await this.schedulesService.getAll();
  }

  @Get('medication/:id')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get schedules by medication ID' })
  @ApiOkResponse({
    description: 'Schedules by medication ID',
    type: Schedule,
    isArray: true,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
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
    },
    description: 'id is not a number',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Medication with ID 1 not found',
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
    description: 'Medication not found',
  })
  async getByMedicationId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedule[]> {
    return await this.schedulesService.getByMedicationId(id);
  }

  @Get('schedule/:id')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiOkResponse({
    description: 'Schedule by ID',
    type: Schedule,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
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
    },
    description: 'id is not a number',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Schedule with ID 1 not found',
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
    description: 'Schedule not found',
  })
  async getByScheduleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedule> {
    return await this.schedulesService.getByScheduleId(id);
  }

  @Get('today')
  @Auth(Role.User)
  @ApiOperation({ summary: "Get today's schedules" })
  @ApiOkResponse({
    description: "Today's schedules",
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          start_date: { type: 'string' },
          medication: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                },
              },
            },
          },
        },
      },
      example: [
        {
          start_date: '2025-05-21T22:00:00.000Z',
          medication: {
            name: 'Paracetamol 600m',
            user: {
              id: '38297b2b-5fa0-4dc6-b41a-59fcf2eeccca',
            },
          },
        },
        {
          start_date: '2025-05-21T22:20:00.000Z',
          medication: {
            name: 'Paracetamol 600m',
            user: {
              id: '38297b2b-5fa0-4dc6-b41a-59fcf2eeccca',
            },
          },
        },
      ],
    },
    isArray: true,
  })
  async getTodayScheduling(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Schedule[]> {
    return await this.schedulesService.getTodayScheduling(user.user_id);
  }

  @Post()
  @Auth(Role.User)
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiBody({
    type: CreateScheduleDTO,
    description: 'Schedule data',
  })
  @ApiCreatedResponse({
    description: 'Schedule created successfully',
    type: Schedule,
  })
  @ApiBadRequestResponse({
    description: 'Schedule could not be created',
  })
  async addSchedule(
    @Body() scheduleData: CreateScheduleDTO,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Schedule> {
    try {
      return await this.schedulesService.addSchedule(
        scheduleData,
        user.user_id,
      );
    } catch (e) {
      let message = 'Schedule could not be created';
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

  @Put(':id')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Update a schedule' })
  @ApiParam({
    name: 'id',
    description: 'Schedule ID',
    required: true,
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cron_expression: {
          type: 'string',
          example: '45 12 * * *',
          description: 'Cron expression for the schedule',
        },
      },
    },
    description: 'Schedule data to update',
  })
  @ApiOkResponse({
    description: 'Schedule updated successfully',
    type: Schedule,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
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
    },
    description: 'id is not a number',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Schedule with ID 1 not found',
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
    description: 'Schedule not found',
  })
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateScheduleDTO,
  ): Promise<Schedule> {
    return await this.schedulesService.updateSchedule(id, updateData);
  }

  @Delete(':id')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiParam({
    name: 'id',
    description: 'Schedule ID',
    required: true,
    type: 'number',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Schedule deleted successfully',
    type: Schedule,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
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
    },
    description: 'id is not a number',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Schedule with ID 1 not found',
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
    description: 'Schedule not found',
  })
  async deleteSchedule(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedule> {
    return await this.schedulesService.deleteSchedule(id);
  }
}
