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
  ) { }

  async getAll() {
    return await this.medicationRepository.find();
  }

  async getOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({ where: { id } });
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

  async addMedication(creationData: CreateMedicationDTO) {
    const { name } = creationData;
    const user = await this.usersService.getOne(
      creationData.userId,
    );
    if (!user) {
      return 'User not found';
    }
    const medication = this.medicationRepository.create({
      name,
      user
    });
    return await this.medicationRepository.save(medication);
  }

  async updateMedication(id: number, updateData: UpdateMedicationDTO) {
    const medication = await this.medicationRepository.findOne({ where: { id } });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    this.medicationRepository.merge(medication, updateData);
    return await this.medicationRepository.save(medication);
  }

  async deleteMedication(id: number) {
    const medication = await this.medicationRepository.findOne({ where: { id } });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return await this.medicationRepository.remove(medication);
  }
}
