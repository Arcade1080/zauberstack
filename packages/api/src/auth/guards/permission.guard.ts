import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { MissingPermissionGraphQLApiError } from '../../errors/graphql/MissingPermissionGraphQLApiError';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/required-permissions.decorator';
import { Permission } from '../enums/permission';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isHttp = context.getType() === 'http';
    const ctx = isHttp ? context : GqlExecutionContext.create(context);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      REQUIRED_PERMISSIONS_KEY,
      [isHttp ? context.getHandler() : ctx.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    let request;
    if (isHttp) {
      request = context.switchToHttp().getRequest();
    } else {
      // @ts-ignore
      const gqlContext = ctx.getContext();
      request = gqlContext.req || gqlContext.request;
    }

    const { user } = request;

    if (!user) {
      return true;
    }

    const userPermissions = user.role.permissions.map(
      (permission) => permission.name,
    );
    const missingPermissions = requiredPermissions.filter(
      (permission) => !userPermissions.includes(permission),
    );

    if (missingPermissions.length > 0) {
      if (isHttp) {
        throw new HttpException(
          `Missing required permission: ${missingPermissions[0]}`,
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new MissingPermissionGraphQLApiError(missingPermissions[0]);
      }
    }

    return true;
  }
}
