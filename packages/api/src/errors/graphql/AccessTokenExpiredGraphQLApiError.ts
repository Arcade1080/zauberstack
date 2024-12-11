import { DateTime } from 'luxon';
import { GraphQLApiError } from '../GraphQLApiErrors';

export class AccessTokenExpiredGraphQLApiError extends GraphQLApiError {
  constructor(expiredAt: Date) {
    super('auth_access_token_expired', 'The access token is expired', {
      expiredAt: DateTime.fromJSDate(expiredAt).toUTC().toISO(),
    });
  }
}
