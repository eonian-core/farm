import type { Provider } from 'ethers'
import { Contract, Interface } from 'ethers'
import { MULTICALL_ABI } from './multicall-abi'

export interface MulticallRequest {
  address: string
  abi: any
  functionName: string
  args: any[]
  allowFailure?: boolean
}

export interface MulticallResponse {
  success: boolean
  data: any
}

interface Aggregate3Request {
  target: string
  allowFailure: boolean
  callData: any
}

interface Aggregate3Response {
  success: boolean
  returnData: string
}

type Aggregate3ReturnDataDecoder = (returnData: string) => any

export class Multicall {
  private interfaces: Interface[]
  private requestData: Aggregate3Request[]
  private responseDecoders: Aggregate3ReturnDataDecoder[]
  private contract: Contract

  constructor(
    multicallAddress: string,
    provider: Provider,
    private requests: MulticallRequest[],
  ) {
    this.interfaces = this.createInterfaces()
    this.requestData = this.prepareRequestData()
    this.responseDecoders = this.createResponseDecoders()
    this.contract = new Contract(multicallAddress, MULTICALL_ABI, provider)
  }

  /**
   * Performs the multicall request.
   * @returns A list of responses that correspond the specified requests.
   */
  public async makeRequest(): Promise<MulticallResponse[]> {
    const results = (await this.contract.aggregate3.staticCall(this.requestData)) as Aggregate3Response[]
    return results.map(
      ({ success, returnData }, index): MulticallResponse => ({
        success,
        data: this.responseDecoders[index](returnData) as unknown,
      }),
    )
  }

  /**
   * Creates contract ABI interfaces.
   * @returns The list of interfaces.
   */

  private createInterfaces(): Interface[] {
    return this.requests.map(({ abi }) => new Interface(abi as string))
  }

  /**
   * Prepares the multicall request data.
   * @returns The encoded request data.
   */
  private prepareRequestData(): Aggregate3Request[] {
    return this.requests.map(
      (request, index): Aggregate3Request => ({
        target: request.address,
        allowFailure: request.allowFailure ?? true,
        callData: this.interfaces[index].encodeFunctionData(request.functionName, request.args),
      }),
    )
  }

  /**
   * Creates the multicall response decoders.
   * @returns The decoders list.
   */
  private createResponseDecoders(): Aggregate3ReturnDataDecoder[] {
    return this.requests.map(
      ({ functionName }, index) =>
        (returnData: string) =>
          this.interfaces[index].decodeFunctionResult(functionName, returnData)[0] as unknown,
    )
  }
}
