import { GraphQLApiError } from '../GraphQLApiErrors';

export class UnauthorizedGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('unauthorized', 'Unauthorized');
  }
}
