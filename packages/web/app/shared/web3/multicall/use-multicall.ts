import React from "react";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import Multicall, { MulticallResponse, MulticallRequest } from "./multicall";

type HookResult = [
  result: MulticallResponse[],
  loading: boolean,
  refetch: () => Promise<MulticallResponse[]>
];

export function useMulticall(
  requests: MulticallRequest[],
  fetchImmediately = true
): HookResult {
  const doMulticall = useRawMulticall(requests);

  const firstFetchRef = React.useRef(false);

  const [result, setResult] = React.useState<MulticallResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * Performs the multicall request.
   */
  const fetch = React.useMemo(() => {
    return async (): Promise<MulticallResponse[]> => {
      const promise = doMulticall?.();
      if (!promise) {
        return [];
      }

      setIsLoading(true);
      const fetchResult = await promise;
      setIsLoading(false);
      setResult(fetchResult);

      return fetchResult;
    };
  }, [doMulticall]);

  /**
   * Makes the request automatically as soon as multicall is ready ({@link doMulticall} is not null).
   * Only if {@link fetchImmediately} is "true".
   */
  React.useEffect(() => {
    if (!doMulticall || !fetchImmediately || firstFetchRef.current) {
      return;
    }
    fetch();
    firstFetchRef.current = true;
  }, [doMulticall, fetchImmediately, fetch]);

  return [result, isLoading, fetch];
}

export function useRawMulticall(
  requests: MulticallRequest[]
): (() => Promise<MulticallResponse[]>) | null {
  const { provider, chain } = useWalletWrapperContext();

  /**
   * Function that performs the multicall request.
   */
  const doMulticall = React.useMemo(() => {
    if (!provider || !chain || requests.length === 0) {
      return null;
    }
    const multicall = new Multicall(chain.multicallAddress, provider, requests);
    return async (): Promise<MulticallResponse[]> => {
      return await multicall.makeRequest();
    };
  }, [provider, chain, requests]);

  return doMulticall;
}
