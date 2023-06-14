import React from "react";
import { Contract, Interface } from "ethers";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { MULTICALL_ABI } from "./multicall-abi";

export interface MulticallRequest {
  address: string;
  abi: any;
  functionName: string;
  args: any[];
  allowFailure?: boolean;
}

export interface MulticallResponse {
  success: boolean;
  data: any;
}

interface Aggregate3Request {
  target: string;
  allowFailure: boolean;
  callData: any;
}

interface Aggregate3Response {
  success: boolean;
  returnData: string;
}

type HookResult = [
  result: MulticallResponse[],
  loading: boolean,
  refetch: () => Promise<MulticallResponse[]>
];

export default function useMulticall(
  requests: MulticallRequest[],
  fetchImmediately = true
): HookResult {
  const { provider } = useWalletWrapperContext();

  const [result, setResult] = React.useState<MulticallResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * Prepares the multicall contract object.
   */
  const multicallContract = useMulticallContract();

  /**
   * Prepares the ABI interfaces used to execute the request.
   */
  const interfaces = useContractInterfaces(requests);

  /**
   * Prepares the call data for multicall requests.
   */
  const multicallData = useMulticallData(requests, interfaces);

  /**
   * Prepares the decoding functions with which the result of the multicall will be parsed.
   */
  const decoders = useResponseDecoders(requests, interfaces);

  /**
   * Determines if we are ready to make the multicall request.
   */
  const isReady = !!provider && !!multicallContract && requests.length > 0;

  /**
   * Performs the multicall request.
   */
  const fetch = React.useMemo(() => {
    return async (): Promise<MulticallResponse[]> => {
      if (!isReady) {
        return [];
      }

      setIsLoading(true);
      const results: Aggregate3Response[] =
        await multicallContract.aggregate3.staticCall(multicallData);
      setIsLoading(false);

      const decodedResults = results.map(
        ({ success, returnData }, index): MulticallResponse => {
          return { success, data: decoders[index](returnData) };
        }
      );
      setResult(decodedResults);

      return decodedResults;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  /**
   * Makes the request automatically as soon as {@link isReady} is set to "true".
   * Only if {@link fetchImmediately} is "true".
   */
  React.useEffect(() => {
    if (!isReady || !fetchImmediately) {
      return;
    }
    fetch();
  }, [isReady, fetchImmediately, fetch]);

  return [result, isLoading, fetch];
}

/**
 * Creates contract interfaces.
 * @param requests - Specified list of the requests.
 * @returns The interfaces.
 */
function useContractInterfaces(requests: MulticallRequest[]) {
  return React.useMemo(() => {
    return requests.map(({ abi }) => new Interface(abi));
  }, [requests]);
}

/**
 * Creates the multicall response decoders.
 * @param requests - Specified list of the requests.
 * @param interfaces - Corresponding contract interfaces for each request.
 * @returns The decoders list.
 */
function useResponseDecoders(
  requests: MulticallRequest[],
  interfaces: Interface[]
) {
  return React.useMemo(() => {
    return requests.map(({ functionName }, index) => {
      return (returnData: string) =>
        interfaces[index].decodeFunctionResult(functionName, returnData)[0];
    });
  }, [requests, interfaces]);
}

/**
 * Prepares the multicall request data.
 * @param requests - Specified list of the requests.
 * @param interfaces - Corresponding contract interfaces for each request.
 * @returns The encoded request data.
 */
function useMulticallData(
  requests: MulticallRequest[],
  interfaces: Interface[]
) {
  return React.useMemo(() => {
    return requests.map(
      (request, index): Aggregate3Request => ({
        target: request.address,
        allowFailure: request.allowFailure ?? true,
        callData: interfaces[index].encodeFunctionData(
          request.functionName,
          request.args
        ),
      })
    );
  }, [requests, interfaces]);
}

/**
 * Creates the multicall contract object, using {@link MULTICALL_ABI}.
 * @returns The multicall contract object
 */
function useMulticallContract() {
  const { wallet, chain } = useWalletWrapperContext();
  const provider = wallet?.provider;

  const multicall = React.useMemo(() => {
    if (!chain || !provider) {
      return null;
    }
    return new Contract(chain.multicallAddress, MULTICALL_ABI, provider);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!provider, chain]);

  return multicall;
}
