import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { AccessTokenExpiredGraphQLApiError } from '../../errors/graphql/AccessTokenExpiredGraphQLApiError';
import { AccessTokenInvalidGraphQLApiError } from '../../errors/graphql/AccessTokenInvalidGraphQLApiError';
import { UnauthorizedGraphQLApiError } from '../../errors/graphql/UnauthorizedGraphQLApiError';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GqlAuthGuard extends AuthGuard('supabase-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info, context) {
    const isHttp = context.getType() === 'http';

    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        if (isHttp) {
          throw new HttpException(
            'Access token expired',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          throw new AccessTokenExpiredGraphQLApiError(info.expiredAt);
        }
      }

      if (info instanceof JsonWebTokenError) {
        if (isHttp) {
          throw new HttpException(
            'Invalid access token',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          throw new AccessTokenInvalidGraphQLApiError();
        }
      }

      if (info && info.message === 'No auth token') {
        if (isHttp) {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        } else {
          throw new UnauthorizedGraphQLApiError();
        }
      }

      throw err;
    }

    return user;
  }
}
