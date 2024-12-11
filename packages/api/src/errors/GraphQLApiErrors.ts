import { GraphQLError } from 'graphql';

export class GraphQLApiError extends GraphQLError {
  constructor(code: string, message: string, extensions?: Record<string, any>) {
    super(message, {
      extensions: {
        code,
        ...extensions,
      },
    });
  }
}
