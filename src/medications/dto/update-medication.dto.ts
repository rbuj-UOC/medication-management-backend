import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationDTO } from './create-medication.dto';

export class UpdateMedicationDTO extends PartialType(CreateMedicationDTO) {}
