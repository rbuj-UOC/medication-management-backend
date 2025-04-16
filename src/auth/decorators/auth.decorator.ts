import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(JwtAuthGuard, RolesGuard));
}