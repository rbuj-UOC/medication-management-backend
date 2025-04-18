import { PartialType } from '@nestjs/mapped-types';
import { CreateIntervalDTO } from './create-interval.dto';

export class UpdateIntervalDTO extends PartialType(CreateIntervalDTO) { }
