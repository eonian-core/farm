import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';

import { SafeAdapter } from '../plugins/SafeAdapter';
import { BaseContract, FunctionFragment, Signer } from 'ethers';
import { getSigner } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { Context } from '../plugins';

export interface SafeTransactionOptions {
    /** Source contract deployment that trigger transaction */
    sourceContractName: string,
    deploymentId: string | null,
    /** Address of target contract */
    address: string,
    /** Instance of target contract */
    contract: BaseContract,
    /** Function fragment or name of function to trigger */
    functionName: FunctionFragment | string,
    /** Arguments for function */
    args: ReadonlyArray<any>,
    /** Signer for transaction, if not provided will be used current source deployment contract signer */
    signer?: Signer
}

export const proposeSafeTransaction = (hre: HardhatRuntimeEnvironment) => async ({
    sourceContractName,
    deploymentId,
    signer,
    address,
    contract,
    functionName,
    args
}: SafeTransactionOptions) => {
    const ctx = new Context(hre, sourceContractName, deploymentId)
    const safe = new SafeAdapter(ctx)

    const contractFactory = await hre.ethers.getContractFactory(sourceContractName)
    signer = signer ?? getSigner(contractFactory.runner)
    if (!signer)
        throw new Error(`Signer for contract "${sourceContractName}" is not defined`)

    return await safe.proposeTransaction(address, contract, functionName, args, signer)
}
