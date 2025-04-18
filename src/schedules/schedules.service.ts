import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedules.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) { }

  async getAll() {
    return await this.scheduleRepository.find();
  }

  async addSchedule(scheduleData: CreateScheduleDTO) {
    const { cron_expression } = scheduleData;
    const schedule = this.scheduleRepository.create({
      cron_expression,
    });
    return await this.scheduleRepository.save(schedule);
  }

  async updateSchedule(id: number, updateData: UpdateScheduleDTO) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    this.scheduleRepository.merge(schedule, updateData);
    return await this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return await this.scheduleRepository.remove(schedule);
  }
}
