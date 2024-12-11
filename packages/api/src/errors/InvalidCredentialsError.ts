export class InvalidCredentialsError extends Error {
  constructor() {
    super('invalid_credentials');
  }
}
