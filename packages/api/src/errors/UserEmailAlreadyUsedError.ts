export class UserEmailAlreadyUsedError extends Error {
  constructor() {
    super('email_already_used');
  }
}
