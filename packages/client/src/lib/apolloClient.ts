import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
  gql,
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Storage from '../services/Storage';
import { refreshAccessToken } from './refreshAccessToken';
import supabase from './supabaseClient';

const { VITE_API_URL } = import.meta.env;

const API_URL = `${VITE_API_URL}/graphql`;

export const reSignIn = makeVar<boolean>(false);

export const RESIGN_IN = gql`
  query ShouldReSignIn {
    reSignIn @client
  }
`;

const getAuthorizationBearer = (token: string | null): string | undefined => {
  if (!token) {
    return undefined;
  }
  return `Bearer ${token}`;
};

const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include',
});

const refreshTokenLink = onError(
  ({ response, graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        const { extensions } = error;
        switch (extensions.code) {
          case 'auth_access_token_expired':
            return new Observable((observer) => {
              refreshAccessToken()
                .then((accessToken) => {
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: getAuthorizationBearer(accessToken),
                    },
                  });
                })
                .then(() => {
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };

                  // Retry last failed request
                  forward(operation).subscribe(subscriber);
                })
                .catch((refreshError) => {
                  observer.error(refreshError);
                });
            });
          case 'auth_access_token_invalid':
          case 'auth_refresh_token_invalid':
          case 'auth_refresh_token_expired':
          case 'unauthorized':
            // @ts-ignore
            response.errors = null;
            reSignIn(true);

            break;
        }
      }
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }

    return null;
  },
);

const authLink = setContext(async (_, { headers }) => {
  // Get the token from Supabase session
  const { data } = await supabase.auth.getSession();
  const authToken = data?.session?.access_token || null;

  return {
    headers: {
      ...headers,
      authorization: getAuthorizationBearer(authToken),
    },
  };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          reSignIn: {
            read() {
              return reSignIn();
            },
          },
        },
      },
    },
  }),
  link: ApolloLink.from([authLink, refreshTokenLink, httpLink]),
});

export default apolloClient;
