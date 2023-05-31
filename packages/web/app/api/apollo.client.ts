import { ApolloClient, InMemoryCache, MutationOptions, OperationVariables, QueryOptions } from '@apollo/client';
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { getHttpLink } from './helpers';

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: getHttpLink(),
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
