import ApiError from './ApiError';

export default class UnknownError extends ApiError {
  constructor(error: Error) {
    super('unknown_error', error.message, error);
  }
}
