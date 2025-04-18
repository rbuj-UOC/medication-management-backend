import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntervalDTO } from './dto/create-interval.dto';
import { UpdateIntervalDTO } from './dto/update-interval.dto';
import { Interval } from './entities/intervals.entity';

@Injectable()
export class IntervalsService {
  constructor(
    @InjectRepository(Interval)
    private intervalRepository: Repository<Interval>,
  ) { }

  async getAll() {
    return await this.intervalRepository.find();
  }

  async addInterval(intervalData: CreateIntervalDTO) {
    const { cron_expression } = intervalData;
    const interval = this.intervalRepository.create({
      cron_expression,
    });
    return await this.intervalRepository.save(interval);
  }

  async updateInterval(id: number, updateData: UpdateIntervalDTO) {
    const interval = await this.intervalRepository.findOne({
      where: { id },
    });
    if (!interval) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }
    this.intervalRepository.merge(interval, updateData);
    return await this.intervalRepository.save(interval);
  }

  async deleteInterval(id: number) {
    const interval = await this.intervalRepository.findOne({
      where: { id },
    });
    if (!interval) {
      throw new NotFoundException(`Interval with ID ${id} not found`);
    }
    return await this.intervalRepository.remove(interval);
  }
}
