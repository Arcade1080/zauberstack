import ApiError from './ApiError';

export default class NetworkError extends ApiError {
  constructor(error: Error) {
    super('network_error', error.message, error);
  }
}
