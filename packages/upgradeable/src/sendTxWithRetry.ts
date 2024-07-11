import { ContractTransactionReceipt, ContractTransactionResponse } from "ethers";

export interface TransactionResult {
    tx: ContractTransactionResponse, 
    receipt: null | ContractTransactionReceipt 
}

/** 
 * Will execute a transaction with retries in case of failure.
 */
export const sendTxWithRetry = async (
  txProducer: () => Promise<ContractTransactionResponse>,
  retries: number = 5,
  delay: number = 5000
): Promise<TransactionResult> => {
    let error: any;

    for (let i = 0; i < retries; i++) {
        try {
            const tx = await txProducer();
            const receipt = await tx.wait();
        
            return { tx: tx, receipt: receipt };
        } catch (e) {
            error = e;
            console.warn(`Failed to send transaction with error`, e);
            if(i + 1 < retries) {
                console.log(`Will retry after ${delay}ms...`);
                await timeout(delay)
            }
        }
    }

    console.error(`Failed to send transaction after ${retries} retries`);
    throw error;
};

export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))