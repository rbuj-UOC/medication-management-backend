import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medications.entity';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  providers: [MedicationsService],
  controllers: [MedicationsController],
})
export class MedicationsModule { }
