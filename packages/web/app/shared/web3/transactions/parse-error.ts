import { ethers } from 'ethers'

export enum TransactionErrorSeverity {
  WARNING = 'warning',
  ERROR = 'error',
}

export function parseError(error: unknown): [string, TransactionErrorSeverity] {
  if (ethers.isError(error, 'ACTION_REJECTED')) {
    return parseActionRejectionError(error)
  }

  if (ethers.isError(error, 'CALL_EXCEPTION')) {
    return parseCallExceptionError(error)
  }

  if (ethers.isError(error, 'UNSUPPORTED_OPERATION')) {
    return parseUnsupportedOperationError(error)
  }

  if (error instanceof Error) {
    return [error.message, TransactionErrorSeverity.ERROR]
  }

  return [JSON.stringify(error), TransactionErrorSeverity.ERROR]
}

function parseUnsupportedOperationError({
  message,
}: ethers.UnsupportedOperationError): [string, TransactionErrorSeverity] {
  return [`Unsupported operation: ${message}`, TransactionErrorSeverity.ERROR]
}

function parseCallExceptionError(error: ethers.CallExceptionError): [string, TransactionErrorSeverity] {
  return [`Transaction failed, reason: ${error.reason || error.message}`, TransactionErrorSeverity.ERROR]
}

function parseActionRejectionError(error: ethers.ActionRejectedError): [string, TransactionErrorSeverity] {
  switch (error.reason) {
    case 'rejected': {
      return [
        'Transaction Rejected: The transaction has been declined or canceled by the user.',
        TransactionErrorSeverity.WARNING,
      ]
    }
    case 'pending': {
      return ['Transaction Rejected: Another transaction is pending.', TransactionErrorSeverity.WARNING]
    }
    case 'expired': {
      return ['Transaction Rejected: The transaction has been expired.', TransactionErrorSeverity.ERROR]
    }
  }
}
