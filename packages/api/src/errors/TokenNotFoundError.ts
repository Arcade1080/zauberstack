export class TokenNotFoundError extends Error {
  constructor() {
    super('token_not_found');
  }
}
