export class RoleNotFoundError extends Error {
  constructor(code = 'role_not_found') {
    super(code);
  }
}
