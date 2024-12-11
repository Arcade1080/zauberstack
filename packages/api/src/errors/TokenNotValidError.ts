export class TokenNotValidError extends Error {
  constructor() {
    super('token_not_valid');
  }
}
