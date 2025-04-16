import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(JwtAuthGuard, RolesGuard));
}
