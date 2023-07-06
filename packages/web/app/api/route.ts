import { NextResponse } from "next/server";

import { getClient } from "./apollo.rsc-client";
import { getVaultBySymbol, getVaultsSymbols } from "./queries";

import { ChainId } from "../providers/wallet/wrappers/helpers";
import { ApolloQueryResult } from "@apollo/client";

export enum ReadQueries {
  VAULT_BY_SYMBOL = "getVaultBySymbol",
  VAULTS_SYMBOLS = "getVaultsSymbols",
}

/**
 * Stands as a proxy to GraphQL Read API. Why do we need it?
 * 1) It forwards requests to the appropriate QPL endpoint, which is determined by the chain ID.
 * 2) It supports cache revalidation (For some reason apollo client ignores NextJS cache settings).
 * @param request The request that was executed to the /api endpoint.
 * @returns The corresponding GraphQL API response.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const { query, chain } = parseOptions(searchParams);

  const client = getClient(chain);
  switch (query) {
    case ReadQueries.VAULT_BY_SYMBOL: {
      const symbol = searchParams.get("symbol")!;
      const data = await getVaultBySymbol(client, symbol);
      return handleResponse(data);
    }
    case ReadQueries.VAULTS_SYMBOLS: {
      const data = await getVaultsSymbols(client);
      return handleResponse(data);
    }
  }
}

function handleResponse<T>({
  data,
  error,
}: Partial<ApolloQueryResult<T>>): NextResponse {
  if (error) {
    throw error;
  }
  return NextResponse.json(data);
}

function parseOptions(searchParams: URLSearchParams) {
  return {
    query: parseQuery(searchParams),
    chain: parseChain(searchParams),
  };
}

function parseQuery(searchParams: URLSearchParams): ReadQueries {
  const query = searchParams.get("query") as ReadQueries | null;
  if (query !== null && Object.values(ReadQueries).indexOf(query) >= 0) {
    return query;
  }
  throw new Error(`Unsupported query: ${query}`);
}

function parseChain(
  searchParams: URLSearchParams
): Exclude<ChainId, ChainId.UNKNOWN> {
  const chain = searchParams.get("chain");
  const chainId = ChainId.getByName(chain);
  if (chainId !== ChainId.UNKNOWN) {
    return chainId;
  }
  throw new Error(`Unsupported chain: ${chain}`);
}
