import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "../guards/auth.guard";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}