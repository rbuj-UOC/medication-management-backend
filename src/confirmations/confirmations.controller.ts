import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { QueryFailedError } from 'typeorm';
import { ConfirmationsService } from './confirmations.service';
import { ConfirmationDTO } from './dto/confirmation.dto';
import { CreateConfirmationDTO } from './dto/create-confirmation.dto';
import { Confirmation } from './entities/confirmations.entity';

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
@Controller('confirmations')
export class ConfirmationsController {
  constructor(private confirmationsService: ConfirmationsService) {}

  @Post()
  @Auth(Role.User)
  @ApiOperation({ summary: 'Crete/Update a schedule confirmation' })
  @ApiBody({
    type: CreateConfirmationDTO,
    description: 'Confirmation data',
  })
  @ApiCreatedResponse({
    description: 'Confirmation created successfully',
    type: Confirmation,
  })
  @ApiBadRequestResponse({
    description: 'Confirmation could not be created',
  })
  async confirm(
    @Body() confirmationData: CreateConfirmationDTO,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Confirmation> {
    try {
      return await this.confirmationsService.confirm(
        confirmationData,
        user.user_id,
      );
    } catch (e) {
      let message = 'Confirmation could not be created';
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

  @Get()
  @Auth(Role.User)
  @ApiOperation({ summary: 'Get confirmations by user ID' })
  @ApiOkResponse({
    description: 'Confirmations by user ID',
    type: ConfirmationDTO,
    isArray: true,
  })
  async getConfirmationHistory(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<ConfirmationDTO[]> {
    return await this.confirmationsService.getConfirmationHistory(user.user_id);
  }
}
