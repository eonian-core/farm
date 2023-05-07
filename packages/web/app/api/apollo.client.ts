import { ApolloClient, InMemoryCache, MutationOptions, OperationVariables, QueryOptions } from '@apollo/client';

export const client = new ApolloClient({
    uri: process.env.GRAPH_URL || 'http://localhost:4000/',
    cache: new InMemoryCache(),
});

export const query = async <T = any, TVariables extends OperationVariables = OperationVariables>(options: QueryOptions<TVariables, T>) => 
    client.query<T, TVariables>(options);

export const mutate = async <TData = any, TVariables extends OperationVariables = OperationVariables, TContext extends Record<string, any> = Record<string, any>, TCache extends InMemoryCache = InMemoryCache>(options: MutationOptions<TData, TVariables, TContext>) =>
    client.mutate<TData, TVariables, TContext, TCache>(options);