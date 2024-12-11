import { GraphQLApiError } from '../GraphQLApiErrors';

export class RefreshTokenInvalidGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('auth_refresh_token_invalid', 'The refresh token is invalid');
  }
}
