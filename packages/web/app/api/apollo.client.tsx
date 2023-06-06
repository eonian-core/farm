"use client";

import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  OperationVariables,
  QueryOptions,
  MutationOptions,
} from "@apollo/client";
import { ErrorResponse, onError } from "@apollo/client/link/error";
import { scalarTypePolicies } from "./gql/graphql";

function errorHandler({ graphQLErrors, networkError }: ErrorResponse) {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
}

export const client = new ApolloClient({
  cache: new InMemoryCache({ typePolicies: scalarTypePolicies }),
  link: from([
    onError(errorHandler),
    new HttpLink({
      uri: process.env.GRAPH_URL || "http://localhost:4000/",
    }),
  ]),
});

export const query = async <
  T = any,
  TVariables extends OperationVariables = OperationVariables
>(
  options: QueryOptions<TVariables, T>
) => client.query<T, TVariables>(options);

export const mutate = async <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends Record<string, any> = Record<string, any>,
  TCache extends InMemoryCache = InMemoryCache
>(
  options: MutationOptions<TData, TVariables, TContext>
) => client.mutate<TData, TVariables, TContext, TCache>(options);
