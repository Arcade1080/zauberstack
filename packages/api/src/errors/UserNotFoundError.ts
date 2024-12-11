export class UserNotFoundError extends Error {
  constructor() {
    super('user_not_found');
  }
}
