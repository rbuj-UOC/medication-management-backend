import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
import { CreateMedicationDTO } from './dto/create-medication.dto';
import { UpdateMedicationDTO } from './dto/update-medication.dto';
import { Medication } from './entities/medications.entity';
import { MedicationsService } from './medications.service';

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
@Controller('medications')
export class MedicationsController {
  constructor(private medicationsService: MedicationsService) {}

  @Get()
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get all medications' })
  @ApiOkResponse({
    description: 'All medications',
    type: Medication,
    isArray: true,
  })
  async getAll(): Promise<Medication[]> {
    return await this.medicationsService.getAll();
  }

  @Get('medication/:id')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get medication by ID' })
  @ApiParam({
    name: 'id',
    description: 'Medication ID',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiOkResponse({
    description: 'Medication by ID',
    type: Medication,
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
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication> {
    return await this.medicationsService.getOne(id, user.user_id);
  }

  @Get('user')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get medications by user ID' })
  @ApiOkResponse({
    description: 'Medications by user ID',
    type: Medication,
    isArray: true,
  })
  async getByUserId(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication[]> {
    return await this.medicationsService.getByUserId(user.user_id);
  }

  @Get('user/:id')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get medications by user ID (Admin)' })
  @ApiParam({
    name: 'id',
    description: 'User ID to whom the medications belong',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @ApiOkResponse({
    description: 'Medications by user ID (Admin)',
    type: Medication,
    isArray: true,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (uuid string is expected)',
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
    description: 'id is not a UUID',
  })
  async getByUserIdAdmin(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Medication[]> {
    return await this.medicationsService.getByUserId(id);
  }

  @Post()
  @Auth(Role.User)
  @ApiOperation({ summary: 'Add a medication' })
  @ApiBody({
    type: CreateMedicationDTO,
    description: 'Medication creation data',
  })
  @ApiCreatedResponse({
    description: 'Medication created successfully',
    type: Medication,
  })
  @ApiBadRequestResponse({
    description: 'Medication could not be created',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Medication could not be created',
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
  })
  async addMedication(
    @Body() creationData: CreateMedicationDTO,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication> {
    try {
      return await this.medicationsService.addMedication(
        creationData,
        user.user_id,
      );
    } catch (e) {
      let message = 'Medication could not be created';
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

  @Post(':userId')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Add a medication (Admin)' })
  @ApiParam({
    name: 'userId',
    description: 'User ID to whom the medication belongs',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @ApiBody({
    type: CreateMedicationDTO,
    description: 'Medication creation data',
  })
  @ApiOkResponse({
    description: 'Medication created successfully (Admin)',
    type: Medication,
  })
  @ApiBadRequestResponse({
    description: 'Medication could not be created',
  })
  async addMedicationAdmin(
    @Body() creationData: CreateMedicationDTO,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Medication> {
    try {
      return await this.medicationsService.addMedication(creationData, userId);
    } catch (e) {
      let message = 'Medication could not be created';
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
  @ApiOperation({ summary: 'Update a medication' })
  @ApiParam({
    name: 'id',
    description: 'Medication ID',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Paracetamol 1g',
        },
      },
    },
    description: 'Medication data to update',
  })
  @ApiOkResponse({
    description: 'Medication updated successfully',
    type: Medication,
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
  async updateMedication(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMedicationDTO,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication> {
    return await this.medicationsService.updateMedication(
      id,
      updateData,
      user.user_id,
    );
  }

  @Delete(':id')
  @Auth(Role.User)
  @ApiOperation({ summary: 'Delete a medication' })
  @ApiParam({
    name: 'id',
    description: 'Medication ID',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiOkResponse({
    description: 'Medication deleted successfully',
    type: Medication,
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
  async deleteMedication(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication> {
    return await this.medicationsService.deleteMedication(id, user.user_id);
  }

  @Get('stats/active')
  @Auth(Role.Admin)
  @ApiOperation({ summary: 'Get active medications (Admin)' })
  @ApiOkResponse({
    description: 'Active medications statistics',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'string',
          example: '10',
        },
        active: {
          type: 'string',
          example: '8',
        },
        paused: {
          type: 'string',
          example: '2',
        },
      },
    },
  })
  async getActiveMedicationStats(): Promise<{
    count: string;
    active: string;
    paused: string;
  }> {
    return await this.medicationsService.getActiveMedicationStats();
  }
}
