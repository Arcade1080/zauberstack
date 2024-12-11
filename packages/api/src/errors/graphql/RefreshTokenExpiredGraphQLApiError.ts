import { DateTime } from 'luxon';
import { GraphQLApiError } from '../GraphQLApiErrors';

export class RefreshTokenExpiredGraphQLApiError extends GraphQLApiError {
  constructor(expiredAt: Date) {
    super('auth_refresh_token_expired', 'The refresh token is expired', {
      expiredAt: DateTime.fromJSDate(expiredAt).toUTC().toISO(),
    });
  }
}
