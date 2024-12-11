import { DateTime } from 'luxon';
import { GraphQLApiError } from '../GraphQLApiErrors';

export class ResetTokenExpiredGraphQLApiError extends GraphQLApiError {
  constructor(expiredAt: Date) {
    super('reset_token_expired', 'The reset token is expired', {
      expiredAt: DateTime.fromJSDate(expiredAt).toUTC().toISO(),
    });
  }
}
