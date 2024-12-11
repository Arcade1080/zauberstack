import { GraphQLApiError } from '../GraphQLApiErrors';

export class TokenExpiredGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('token_expired', 'Token expired');
  }
}
