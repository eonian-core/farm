import { HardhatRuntimeEnvironment } from "hardhat/types"
import { needUseSafe } from "../plugins"
import { sendTxWithRetry } from "../sendTxWithRetry"
import { SafeTransactionOptions } from "./proposeSafeTransaction"

export const proposeOrSendTx = (hre: HardhatRuntimeEnvironment) => async (options: SafeTransactionOptions) => {
    if(needUseSafe()) {
        console.log("Proposing Safe transaction:", prettifySafeOptions(options))
        await hre.proposeSafeTransaction(options)
        return
    }

    console.log("Sending transaction:", prettifySafeOptions(options))

    const { contract, functionName, args } = options
    await sendTxWithRetry(async () => 
        // TS magic, that cast Safe options types that are not represent real types
        // For example, if given params: 
        //  contract: vault, 
        //  functionName: addStrategy
        // then will execute vault.addStrategy(...args)
        await (contract as any)[functionName as string](...args)
    )
}

function prettifySafeOptions({sourceContractName, deploymentId, address, contract, functionName, args}: SafeTransactionOptions) {
    let contractName = "Cannot pretify contract name"
    try {
        contractName = (contract as any).constructor.name
    } catch (error) {
        console.error("Error getting contract name:", error)
    }

    return {
        sourceContractName,
        deploymentId,
        address,
        contract: contractName,
        functionName,
        args
    }
}