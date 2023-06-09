import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  Approval,
  AuthorizedOperator,
  BeaconUpgraded,
  BorrowerDebtManagementReported,
  Burned,
  Deposit,
  Initialized,
  LockedProfitReleaseRateChanged,
  Minted,
  OwnershipTransferred,
  Paused,
  RevokedOperator,
  Sent,
  StrategyAdded,
  StrategyRemoved,
  StrategyReturnedToQueue,
  StrategyRevoked,
  Transfer,
  Unpaused,
  Upgraded,
  Withdraw
} from "../generated/VaultImplementation/VaultImplementation"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createAuthorizedOperatorEvent(
  operator: Address,
  tokenHolder: Address
): AuthorizedOperator {
  let authorizedOperatorEvent = changetype<AuthorizedOperator>(newMockEvent())

  authorizedOperatorEvent.parameters = new Array()

  authorizedOperatorEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  authorizedOperatorEvent.parameters.push(
    new ethereum.EventParam(
      "tokenHolder",
      ethereum.Value.fromAddress(tokenHolder)
    )
  )

  return authorizedOperatorEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createBorrowerDebtManagementReportedEvent(
  borrower: Address,
  debtPayment: BigInt,
  freeFunds: BigInt,
  fundsGiven: BigInt,
  fundsTaken: BigInt,
  loss: BigInt
): BorrowerDebtManagementReported {
  let borrowerDebtManagementReportedEvent = changetype<
    BorrowerDebtManagementReported
  >(newMockEvent())

  borrowerDebtManagementReportedEvent.parameters = new Array()

  borrowerDebtManagementReportedEvent.parameters.push(
    new ethereum.EventParam("borrower", ethereum.Value.fromAddress(borrower))
  )
  borrowerDebtManagementReportedEvent.parameters.push(
    new ethereum.EventParam(
      "debtPayment",
      ethereum.Value.fromUnsignedBigInt(debtPayment)
    )
  )
  borrowerDebtManagementReportedEvent.parameters.push(
    new ethereum.EventParam(
      "freeFunds",
      ethereum.Value.fromUnsignedBigInt(freeFunds)
    )
  )
  borrowerDebtManagementReportedEvent.parameters.push(
    new ethereum.EventParam(
      "fundsGiven",
      ethereum.Value.fromUnsignedBigInt(fundsGiven)
    )
  )
  borrowerDebtManagementReportedEvent.parameters.push(
    new ethereum.EventParam(
      "fundsTaken",
      ethereum.Value.fromUnsignedBigInt(fundsTaken)
    )
  )
  borrowerDebtManagementReportedEvent.parameters.push(
    new ethereum.EventParam("loss", ethereum.Value.fromUnsignedBigInt(loss))
  )

  return borrowerDebtManagementReportedEvent
}

export function createBurnedEvent(
  operator: Address,
  from: Address,
  amount: BigInt,
  data: Bytes,
  operatorData: Bytes
): Burned {
  let burnedEvent = changetype<Burned>(newMockEvent())

  burnedEvent.parameters = new Array()

  burnedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  burnedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  burnedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  burnedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  burnedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorData",
      ethereum.Value.fromBytes(operatorData)
    )
  )

  return burnedEvent
}

export function createDepositEvent(
  caller: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createLockedProfitReleaseRateChangedEvent(
  rate: BigInt
): LockedProfitReleaseRateChanged {
  let lockedProfitReleaseRateChangedEvent = changetype<
    LockedProfitReleaseRateChanged
  >(newMockEvent())

  lockedProfitReleaseRateChangedEvent.parameters = new Array()

  lockedProfitReleaseRateChangedEvent.parameters.push(
    new ethereum.EventParam("rate", ethereum.Value.fromUnsignedBigInt(rate))
  )

  return lockedProfitReleaseRateChangedEvent
}

export function createMintedEvent(
  operator: Address,
  to: Address,
  amount: BigInt,
  data: Bytes,
  operatorData: Bytes
): Minted {
  let mintedEvent = changetype<Minted>(newMockEvent())

  mintedEvent.parameters = new Array()

  mintedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  mintedEvent.parameters.push(
    new ethereum.EventParam(
      "operatorData",
      ethereum.Value.fromBytes(operatorData)
    )
  )

  return mintedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRevokedOperatorEvent(
  operator: Address,
  tokenHolder: Address
): RevokedOperator {
  let revokedOperatorEvent = changetype<RevokedOperator>(newMockEvent())

  revokedOperatorEvent.parameters = new Array()

  revokedOperatorEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  revokedOperatorEvent.parameters.push(
    new ethereum.EventParam(
      "tokenHolder",
      ethereum.Value.fromAddress(tokenHolder)
    )
  )

  return revokedOperatorEvent
}

export function createSentEvent(
  operator: Address,
  from: Address,
  to: Address,
  amount: BigInt,
  data: Bytes,
  operatorData: Bytes
): Sent {
  let sentEvent = changetype<Sent>(newMockEvent())

  sentEvent.parameters = new Array()

  sentEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )
  sentEvent.parameters.push(
    new ethereum.EventParam(
      "operatorData",
      ethereum.Value.fromBytes(operatorData)
    )
  )

  return sentEvent
}

export function createStrategyAddedEvent(
  strategy: Address,
  debtRatio: BigInt
): StrategyAdded {
  let strategyAddedEvent = changetype<StrategyAdded>(newMockEvent())

  strategyAddedEvent.parameters = new Array()

  strategyAddedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  strategyAddedEvent.parameters.push(
    new ethereum.EventParam(
      "debtRatio",
      ethereum.Value.fromUnsignedBigInt(debtRatio)
    )
  )

  return strategyAddedEvent
}

export function createStrategyRemovedEvent(
  strategy: Address,
  fromQueueOnly: boolean
): StrategyRemoved {
  let strategyRemovedEvent = changetype<StrategyRemoved>(newMockEvent())

  strategyRemovedEvent.parameters = new Array()

  strategyRemovedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  strategyRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "fromQueueOnly",
      ethereum.Value.fromBoolean(fromQueueOnly)
    )
  )

  return strategyRemovedEvent
}

export function createStrategyReturnedToQueueEvent(
  strategy: Address
): StrategyReturnedToQueue {
  let strategyReturnedToQueueEvent = changetype<StrategyReturnedToQueue>(
    newMockEvent()
  )

  strategyReturnedToQueueEvent.parameters = new Array()

  strategyReturnedToQueueEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )

  return strategyReturnedToQueueEvent
}

export function createStrategyRevokedEvent(strategy: Address): StrategyRevoked {
  let strategyRevokedEvent = changetype<StrategyRevoked>(newMockEvent())

  strategyRevokedEvent.parameters = new Array()

  strategyRevokedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )

  return strategyRevokedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createWithdrawEvent(
  caller: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}
