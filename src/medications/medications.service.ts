import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMedicationDTO } from './dto/create-medication.dto';
import { UpdateMedicationDTO } from './dto/update-medication.dto';
import { Medication } from './entities/medications.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
    private readonly usersService: UsersService,
  ) {}

  async getAll() {
    return await this.medicationRepository.find();
  }

  async getOne(id: number, user_id: string): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id, user: { id: user_id } },
      relations: ['user'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  async getByUserId(userId: string): Promise<Medication[]> {
    return this.medicationRepository.find({
      where: { user: { id: userId } },
    });
  }

  async addMedication(creationData: CreateMedicationDTO, userId: string) {
    const { name } = creationData;
    if (creationData.user_id !== userId) {
      throw new NotFoundException(`UserIds aren't equal`);
    }
    const user = await this.usersService.getOne(creationData.user_id);
    if (!user) {
      throw new NotFoundException(
        `User not found ${creationData.user_id} not found`,
      );
    }
    const medication = this.medicationRepository.create({
      name,
      user,
    });
    return await this.medicationRepository.save(medication);
  }

  async updateMedication(
    id: number,
    updateData: UpdateMedicationDTO,
    userId: string,
  ) {
    const medication = await this.medicationRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    if (medication.user.id !== userId) {
      throw new NotFoundException(`UserIds aren't equal`);
    }
    this.medicationRepository.merge(medication, updateData);
    return await this.medicationRepository.save(medication);
  }

  async deleteMedication(id: number, userId: string) {
    const medication = await this.medicationRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    if (medication.user.id !== userId) {
      throw new NotFoundException(`UserIds aren't equal`);
    }
    return await this.medicationRepository.remove(medication);
  }
}
