import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Medication } from './entities/medications.entity';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medication, User])],
  providers: [MedicationsService, UsersService],
  controllers: [MedicationsController]
})
export class MedicationsModule { }
