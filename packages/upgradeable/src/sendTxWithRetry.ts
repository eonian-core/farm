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
): Promise<TransactionResult> => await retryOnFailureWithDelay({ retries, delay }, async () => {
    const tx = await txProducer();
    const receipt = await tx.wait();
    return { tx, receipt };
})

export interface RetryOnFailureOptions {
    retries: number,
    delay: number,
    /** Logger for errors and info messages */
    logger?: Console,
    isNeedRetry?: (error: any, attempt: number) => Promise<boolean>
}

export const retryOnFailureWithDelay = async <T>({ retries, delay, logger = console, isNeedRetry = async () => true }: RetryOnFailureOptions, action: () => Promise<T>): Promise<T> =>
    retryOnFailure(action, async (error, attempt) => {
        logger.warn(`Failed to send transaction with error`, error);

        if (!await isNeedRetry(error, attempt)) {
            logger.error(`Need retry return false, will stop retries`, error);
            return false;
        }

        if (attempt + 1 < retries) {
            logger.log(`Will retry after ${delay}ms...`);
            await timeout(delay)

            return true
        }

        return false;
    }, logger)


export const retryOnFailure = async <T>(
    action: () => Promise<T>,
    isNeedRetry: (error: any, attempt: number) => Promise<boolean>,
    logger: Console = console
): Promise<T> => {
    let attempt = 0;
    let error: any;

    let shouldRetry = false
    do {
        try {
            return await action();
        } catch (e) {
            error = e
        }

        shouldRetry = await isNeedRetry(error, attempt);
        attempt++;
    } while (shouldRetry)

    logger.error(`Failed to perform action after ${attempt} retries`);
    throw error;
}

export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))