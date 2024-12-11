import { GraphQLApiError } from '../GraphQLApiErrors';

export class NotFoundGraphQLApiError extends GraphQLApiError {
  constructor() {
    super('ressource_not_found', 'The requested ressource could not be found.');
  }
}
