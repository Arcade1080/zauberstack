import { GraphQLApiError } from '../GraphQLApiErrors';

export class GraphQLApiMethodNotAllowed extends GraphQLApiError {
  constructor() {
    super('method_not_allowed', 'Method not allowed');
  }
}
