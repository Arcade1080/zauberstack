export class MethodNotAllowedError extends Error {
  constructor(code = 'method_not_allowed') {
    super(code);
  }
}
