import { ApolloError } from '@apollo/client';
import ApiError from './ApiError';
import { InvalidInputArgs, GraphQLExtensions } from './Types';

export default class GraphQLError extends ApiError {
  protected inputErrors: InvalidInputArgs = {};
  protected extensions: GraphQLExtensions;

  constructor(code: string | any, error: ApolloError) {
    super(code, error.graphQLErrors[0].message, error);

    this.extensions = error.graphQLErrors[0].extensions || {};

    if (code === 'BAD_USER_INPUT') {
      this.inputErrors = error.graphQLErrors[0].extensions
        .invalidInputArgs as InvalidInputArgs;
    }
  }

  hasInputErrors(): boolean {
    return this.inputErrors && Object.keys(this.inputErrors).length !== 0;
  }

  getInputErrors(): any {
    return this.inputErrors;
  }

  getExtensions(): GraphQLExtensions {
    return this.extensions;
  }
}
