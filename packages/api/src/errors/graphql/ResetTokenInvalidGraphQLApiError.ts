import { GraphQLApiError } from '../GraphQLApiErrors';

export class ResetTokenInvalidGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('reset_token_invalid', 'The reset token is invalid');
  }
}
