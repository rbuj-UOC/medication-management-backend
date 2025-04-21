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
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enums/role.enum';
import { QueryFailedError } from 'typeorm';
import { CreateMedicationDTO } from './dto/create-medication.dto';
import { UpdateMedicationDTO } from './dto/update-medication.dto';
import { Medication } from './entities/medications.entity';
import { MedicationsService } from './medications.service';

@Controller('medications')
export class MedicationsController {
  constructor(private medicationsService: MedicationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<Medication[]> {
    return await this.medicationsService.getAll();
  }

  @Get('medication/:id')
  @Auth(Role.User)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Medication> {
    return await this.medicationsService.getOne(id);
  }

  @Get('user/:id')
  @Auth(Role.User)
  async getByUserId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Medication[]> {
    return await this.medicationsService.getByUserId(id);
  }

  @Post()
  async addMedication(
    @Body() creationData: CreateMedicationDTO,
  ): Promise<Medication> {
    try {
      return await this.medicationsService.addMedication(creationData);
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
  ): Promise<Medication> {
    return await this.medicationsService.updateMedication(id, updateData);
  }

  @Delete(':id')
  @Auth(Role.User)
  async deleteMedication(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Medication> {
    return await this.medicationsService.deleteMedication(id);
  }
}
