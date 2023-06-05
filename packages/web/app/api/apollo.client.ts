import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  from,
} from "@apollo/client";
import { ErrorResponse, onError } from "@apollo/client/link/error";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { scalarTypePolicies } from "./gql/graphql";

function errorHandler(error: ErrorResponse) {
  // We need this empty error handler to be able to catch errors via try/catch
}

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ typePolicies: scalarTypePolicies }),
    link: from([
      onError(errorHandler),
      new HttpLink({
        uri: process.env.GRAPH_URL || "http://localhost:4000/",
      }),
    ]),
  });
});

export const query = async <
  T = any,
  TVariables extends OperationVariables = OperationVariables
>(
  options: QueryOptions<TVariables, T>
) => getClient().query<T, TVariables>(options);

export const mutate = async <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends Record<string, any> = Record<string, any>,
  TCache extends InMemoryCache = InMemoryCache
>(
  options: MutationOptions<TData, TVariables, TContext>
) => getClient().mutate<TData, TVariables, TContext, TCache>(options);
