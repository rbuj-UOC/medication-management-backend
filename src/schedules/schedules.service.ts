import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicationsService } from 'src/medications/medications.service';
import { Repository } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedules.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly medicationsService: MedicationsService,
  ) {}

  async getAll() {
    return await this.scheduleRepository.find();
  }

  async getByMedicationId(id: number): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      where: { medication: { id } },
    });
  }

  async getByScheduleId(id: number): Promise<Schedule> {
    return await this.scheduleRepository.findOne({
      where: { id },
    });
  }

  async addSchedule(scheduleData: CreateScheduleDTO) {
    const { start_date, hour, minute, cron_expression, disabled } =
      scheduleData;
    const medication = await this.medicationsService.getOne(
      scheduleData.medicationId,
    );
    if (!medication) {
      throw new NotFoundException(
        `Medication with ID ${scheduleData.medicationId} not found`,
      );
    }
    const schedule = this.scheduleRepository.create({
      start_date,
      hour,
      minute,
      cron_expression,
      disabled,
      medication,
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
