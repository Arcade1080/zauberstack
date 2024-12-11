export default class ApiError {
  protected code: string;
  protected message: string;
  protected error: object;

  constructor(code: string, message: string, error: Error) {
    this.code = code;
    this.message = message;
    this.error = error;
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }

  getError() {
    return this.error;
  }
}
