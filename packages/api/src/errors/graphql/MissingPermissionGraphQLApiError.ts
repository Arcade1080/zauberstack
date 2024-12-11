import { GraphQLApiError } from '../GraphQLApiErrors';

export class MissingPermissionGraphQLApiError extends GraphQLApiError {
  constructor(permission: string) {
    super(
      'missing_permission',
      'You have insufficient permissions to execute this request',
      { missingPermission: permission },
    );
  }
}
