import { ApolloError } from '@apollo/client';
import ApiError from './ApiError';
import GraphQLError from './GraphQLError';
import NetworkError from './NetworkError';
import UnknownError from './UnknownError';

export interface ErrorDto {
  errorMessage: string;
  errorcode: string;
  inputErrors: { [key: string]: string } | null;
}

class ErrorService {
  protected static getApiError(
    error: ApolloError,
  ): NetworkError | GraphQLError | UnknownError {
    if (!error.graphQLErrors && !error.networkError) {
      return new UnknownError(error);
    }

    if (error.networkError) {
      return new NetworkError(error);
    }

    return new GraphQLError(error.graphQLErrors[0].extensions.code, error);
  }

  public static getErrors(error: ApolloError): ErrorDto {
    const apiError = this.getApiError(error);

    if (apiError instanceof GraphQLError) {
      return ErrorService.handleGraphQLError(apiError);
    }

    if (apiError instanceof NetworkError) {
      return ErrorService.handleNetworkError(apiError);
    }

    return ErrorService.handleUnknownError(apiError);
  }
  static handleNetworkError(apiError: NetworkError): ErrorDto {
    return ErrorService.getDtoForApiError(apiError);
  }

  private static handleUnknownError(apiError: UnknownError): ErrorDto {
    return ErrorService.getDtoForApiError(apiError);
  }

  private static getMessageForApiErrorCode(
    errorCode: string,
    message: string,
  ): string {
    const errorMesage = apiErrorMessages[errorCode];

    if (typeof errorMesage === 'function') {
      return errorMesage(message);
    }

    return errorMesage;
  }

  public static getMessageForInputValidationErrorCode(error: any): string {
    const errorKey = Object.keys(error)[0];
    const errorMessage = error[errorKey];

    return (
      inputValidationErrorMessages[errorKey] ||
      `Error: ${errorKey} - ${errorMessage}`
    );
  }

  private static getDtoForApiError(apiError: ApiError): ErrorDto {
    const errorDto: ErrorDto = {
      errorMessage:
        ErrorService.getMessageForApiErrorCode(
          apiError.getCode(),
          apiError.getMessage(),
        ) || apiError.getMessage(),
      errorcode: apiError.getCode(),
      inputErrors: null,
    };

    return errorDto;
  }

  private static handleGraphQLError(apiError: GraphQLError): ErrorDto {
    const errorDto = ErrorService.getDtoForApiError(apiError);

    if (apiError.hasInputErrors()) {
      errorDto.inputErrors = apiError.getInputErrors();
    }

    return errorDto;
  }
}

export default ErrorService;

const apiErrorMessages: {
  [key: string]: string | ((message: string) => string);
} = {
  BAD_USER_INPUT: 'There was a problem with your input. Please try again.',
  user_not_found:
    "We couldn't find an account with that email. Please try again.",
  auth_invalid_credentials:
    "We couldn't find an account with that email or password. Please try again.",
  email_already_used:
    'The email address is already in use. Please try another one.',
  token_not_found:
    'Your password reset token is invalid or has expired. Please try again.',
  network_error: (info: string) =>
    `We couldn't connect to the server. Please check your internet connection and try again. (Error: "${info}")`,
};

const inputValidationErrorMessages: { [key: string]: string } = {
  isEmail: 'Please enter a valid email address',
  minLength: 'Your password should have at least 8 characters',
};
