import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserInterface } from '../interfaces/active-user.interface';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: ActiveUserInterface }>();
    return request.user;
  },
);
