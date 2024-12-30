import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  const user = request.user;
  // console.log('cookie', request.cookies['Authentication']);

  return data ? user?.[data] : user;
});
