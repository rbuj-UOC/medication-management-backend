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
import { CreateIntervalDTO } from './dto/create-interval.dto';
import { UpdateIntervalDTO } from './dto/update-interval.dto';
import { IntervalsService } from './intervals.service';

@Controller('interval')
export class IntervalsController {
  constructor(private intervalsService: IntervalsService) { }

  @Get('getAll')
  @Auth(Role.Admin)
  async getAll() {
    return await this.intervalsService.getAll();
  }

  @Post('create')
  @Auth(Role.User)
  async addInterval(@Body() intervalData: CreateIntervalDTO) {
    try {
      await this.intervalsService.addInterval(intervalData);
    } catch (e) {
      let message = 'Interval could not be created';
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
    return 'Interval created successfully';
  }

  @Put('update/:id')
  @Auth(Role.User)
  async updateInterval(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateIntervalDTO,
  ) {
    await this.intervalsService.updateInterval(id, updateData);
    return 'Interval updated successfully';
  }

  @Delete('delete/:id')
  @Auth(Role.User)
  async deleteInterval(@Param('id', ParseIntPipe) id: number) {
    await this.intervalsService.deleteInterval(id);
    return 'Interval deleted successfully';
  }
}
