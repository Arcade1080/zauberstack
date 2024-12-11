import { GraphQLApiError } from '../GraphQLApiErrors';

export class UserEmailAlreadyUsedGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('email_already_used', 'Email already used');
  }
}
