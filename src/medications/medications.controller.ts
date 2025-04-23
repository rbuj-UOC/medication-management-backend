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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { QueryFailedError } from 'typeorm';
import { CreateMedicationDTO } from './dto/create-medication.dto';
import { UpdateMedicationDTO } from './dto/update-medication.dto';
import { Medication } from './entities/medications.entity';
import { MedicationsService } from './medications.service';

@Controller('medications')
export class MedicationsController {
  constructor(private medicationsService: MedicationsService) {}

  @Get()
  @Auth(Role.Admin)
  async getAll(): Promise<Medication[]> {
    return await this.medicationsService.getAll();
  }

  @Get('medication/:id')
  @Auth(Role.User)
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication> {
    return await this.medicationsService.getOne(id, user.user_id);
  }

  @Get('user')
  @Auth(Role.User)
  async getByUserId(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication[]> {
    return await this.medicationsService.getByUserId(user.user_id);
  }

  @Get('user/:id')
  @Auth(Role.Admin)
  async getByUserIdAdmin(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Medication[]> {
    return await this.medicationsService.getByUserId(id);
  }

  @Post()
  @Auth(Role.User)
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
        'detail' in e.driverError &&
        typeof e.driverError.detail === 'string'
      ) {
        message = e.driverError.detail;
      }
      throw new BadRequestException(message);
    }
  }

  @Post(':userId')
  @Auth(Role.Admin)
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
        'detail' in e.driverError &&
        typeof e.driverError.detail === 'string'
      ) {
        message = e.driverError.detail;
      }
      throw new BadRequestException(message);
    }
  }

  @Put(':id')
  @Auth(Role.User)
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
  async deleteMedication(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Medication> {
    return await this.medicationsService.deleteMedication(id, user.user_id);
  }
}
