import { GetVaultsQuery, GetVaultsSymbolsQuery, Vault } from "./gql/graphql";
import { ReadQueries } from "./route";

const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST ||
  "https://" + process.env.NEXT_PUBLIC_VERCEL_URL ||
  "http://localhost:3000/";

const CACHE_TTL_SECONDS: Record<ReadQueries, number> = {
  [ReadQueries.VAULTS_SYMBOLS]: 120,
  [ReadQueries.VAULT_BY_SYMBOL]: 30,
};

/**
 * Gets the symbols of all existing vaults.
 * @param chainName The name of the chain to which the request is made.
 * @returns An array of the symbols.
 */
export const fetchVaultsSymbols = async (
  chainName: string
): Promise<string[]> => {
  const query = ReadQueries.VAULTS_SYMBOLS;
  const data = await makeReadRequest<GetVaultsSymbolsQuery>(query, chainName);
  const { vaults } = data;
  return vaults.map((vault) => vault.symbol);
};

/**
 * Gets the vault by provided symbol.
 * @param symbol The symbol of the vault.
 * @param chainName The name of the chain to which the request is made.
 * @returns The vault model.
 */
export const fetchVault = async (
  symbol: string,
  chainName: string
): Promise<Vault> => {
  const query = ReadQueries.VAULT_BY_SYMBOL;
  const params = { symbol };
  const data = await makeReadRequest<GetVaultsQuery>(query, chainName, params);
  return data.vaults[0] as Vault;
};

/**
 * Makes a request to internal GraphQL API proxy.
 * @param query - The GraphQL query name.
 * @param chainName - The name of the chain to which the request is made.
 * @param params The query parameters that will be passed as query parameters.
 * @returns The result of the corresponding GraphQL query.
 */
async function makeReadRequest<T>(
  query: ReadQueries,
  chainName: string,
  params: Record<string, any> = {}
): Promise<T> {
  const searchParams = new URLSearchParams({
    query: query,
    chain: chainName,
    ...params,
  });
  const url = new URL("/api", API_HOST);
  const input = url.href + "?" + searchParams.toString();
  const response = await fetch(input, {
    next: { revalidate: CACHE_TTL_SECONDS[query] },
  });
  const data = await response.json();
  return data as T;
}
