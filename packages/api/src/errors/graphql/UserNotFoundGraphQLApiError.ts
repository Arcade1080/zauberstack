import { GraphQLApiError } from '../GraphQLApiErrors';

export class GraphQLApiErrorUserNotFound extends GraphQLApiError {
  constructor() {
    super('user_not_found', 'User not found');
  }
}
