import { GraphQLApiError } from '../GraphQLApiErrors';

export class InvalidCredentialsGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('auth_invalid_credentials', 'The given credentials are invalid');
  }
}
