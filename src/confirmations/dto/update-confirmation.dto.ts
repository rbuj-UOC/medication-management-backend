import { PartialType } from '@nestjs/mapped-types';
import { CreateConfirmationDTO } from './create-confirmation.dto';

export class UpdateMedicationDTO extends PartialType(CreateConfirmationDTO) {}
