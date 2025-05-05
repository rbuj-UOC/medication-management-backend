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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interface';
import { QueryFailedError } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedules.entity';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  @Auth(Role.Admin)
  async getAll(): Promise<Schedule[]> {
    return await this.schedulesService.getAll();
  }

  @Get('medication/:id')
  @Auth(Role.User)
  async getByMedicationId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedule[]> {
    return await this.schedulesService.getByMedicationId(id);
  }

  @Get('schedule/:id')
  @Auth(Role.User)
  async getByScheduleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedule> {
    return await this.schedulesService.getByScheduleId(id);
  }

  @Get('today')
  @Auth(Role.User)
  async getTodayScheduling(
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Schedule[]> {
    return await this.schedulesService.getTodayScheduling(user.user_id);
  }

  @Post()
  @Auth(Role.User)
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
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateScheduleDTO,
  ): Promise<Schedule> {
    return await this.schedulesService.updateSchedule(id, updateData);
  }

  @Delete(':id')
  @Auth(Role.User)
  async deleteSchedule(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Schedule> {
    return await this.schedulesService.deleteSchedule(id);
  }
}
