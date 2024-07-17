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
): Promise<TransactionResult> => retryOnFailure({retries, delay}, async () => {
    const tx = await txProducer();
    const receipt = await tx.wait();
    return { tx, receipt };
})

export interface RetryOnFailureOptions {
    retries: number,
    delay: number,
    /** Logger for errors and info messages */
    logger?: Console
}

export async function retryOnFailure<T>({retries, delay, logger = console}: RetryOnFailureOptions, action: () => Promise<T>): Promise<T> {
    // save to rethrow at the end if fail after all retries
    let error: any;

    for (let i = 0; i < retries; i++) {
        try {
            // important to await the action here, to catch the error
            return await action();
        } catch (e) {
            error = e
            if(i + 1 < retries) {
                logger.warn(`Failed to send transaction with error`, error);
                logger.log(`Will retry after ${delay}ms...`);
                await timeout(delay)
            } 
        }
    }

    logger.error(`Failed to send transaction after ${retries} retries`);
    throw error;
}

export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))