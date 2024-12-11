import { GraphQLApiError } from '../GraphQLApiErrors';

export class GraphQLApiErrorTokenNotFound extends GraphQLApiError {
  constructor() {
    super('token_not_found', 'Token not found');
  }
}
