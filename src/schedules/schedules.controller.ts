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
import { Role } from 'src/common/enums/role.enum';
import { QueryFailedError } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedule')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get('getAll')
  @Auth(Role.Admin)
  async getAll() {
    return await this.schedulesService.getAll();
  }

  @Post('create')
  @Auth(Role.User)
  async addSchedule(@Body() scheduleData: CreateScheduleDTO) {
    try {
      await this.schedulesService.addSchedule(scheduleData);
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
    return 'Schedule created successfully';
  }

  @Put('update/:id')
  @Auth(Role.User)
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateScheduleDTO,
  ) {
    await this.schedulesService.updateSchedule(id, updateData);
    return 'Schedule updated successfully';
  }

  @Delete('delete/:id')
  @Auth(Role.User)
  async deleteSchedule(@Param('id', ParseIntPipe) id: number) {
    await this.schedulesService.deleteSchedule(id);
    return 'Schedule deleted successfully';
  }
}
