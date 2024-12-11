import { GraphQLApiError } from '../GraphQLApiErrors';

export class TokenNotValidGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('token_not_valid', 'Token not valid');
  }
}
