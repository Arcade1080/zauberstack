import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      // REST
      return context.switchToHttp().getRequest().user;
    } else {
      // GraphQL request
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    }
  },
);
