import { GraphQLApiError } from '../GraphQLApiErrors';

export class AccessTokenInvalidGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('auth_access_token_invalid', 'The access token is invalid');
  }
}
