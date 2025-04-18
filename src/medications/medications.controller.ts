import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { QueryFailedError } from 'typeorm';
import { CreateMedicationDTO } from './dto/create-medication.dto';
import { UpdateMedicationDTO } from './dto/update-medication.dto';
import { Medication } from './entities/medications.entity';
import { MedicationsService } from './medications.service';

@Controller('medication')
export class MedicationsController {
  constructor(private medicationsService: MedicationsService) { }

  @Get('getAll')
  @Auth(Role.Admin)
  async getAll() {
    return await this.medicationsService.getAll();
  }

  @Get('getOne/:id')
  @Auth(Role.User)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Medication> {
    return await this.medicationsService.getOne(id);
  }

  @Post('create')
  async addMedication(@Body() creationData: CreateMedicationDTO) {
    try {
      await this.medicationsService.addMedication(creationData);
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
    return 'Medication created successfully';
  }

  @Put('update/:id')
  @Auth(Role.User)
  async updateMedication(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMedicationDTO,
  ) {
    await this.medicationsService.updateMedication(id, updateData);
    return 'Medication updated successfully';
  }

  @Delete('delete/:id')
  @Auth(Role.User)
  async deleteMedication(@Param('id', ParseIntPipe) id: number) {
    await this.medicationsService.deleteMedication(id);
    return 'Medication deleted successfully';
  }
}
