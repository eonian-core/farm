import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  AdminChanged as AdminChangedEvent,
  Approval as ApprovalEvent,
  AuthorizedOperator as AuthorizedOperatorEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  BorrowerDebtManagementReported as BorrowerDebtManagementReportedEvent,
  Burned as BurnedEvent,
  Deposit as DepositEvent,
  Initialized as InitializedEvent,
  LockedProfitReleaseRateChanged as LockedProfitReleaseRateChangedEvent,
  Minted as MintedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  RevokedOperator as RevokedOperatorEvent,
  Sent as SentEvent,
  StrategyAdded as StrategyAddedEvent,
  StrategyRemoved as StrategyRemovedEvent,
  StrategyReturnedToQueue as StrategyReturnedToQueueEvent,
  StrategyRevoked as StrategyRevokedEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent,
  Upgraded as UpgradedEvent,
  Withdraw as WithdrawEvent,
  Vault
} from "../generated/Vault/Vault"
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
  Withdraw,
  Vault as VaultEntity
 } from "../generated/schema"
import { DependencyContainer } from "./dependency-container"

/** Build dependencies and run hooks */
export function runApp(eventName: string, event: ethereum.Event): void {
  const container = new DependencyContainer(eventName, event)

  container.vaultService.createOrUpdateVault(event.address)
}

export function handleAdminChanged(event: AdminChangedEvent): void {
  let entity = new AdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('AdminChangedEvent', event)
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('ApprovalEvent', event)
}

export function handleAuthorizedOperator(event: AuthorizedOperatorEvent): void {
  let entity = new AuthorizedOperator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.tokenHolder = event.params.tokenHolder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('AuthorizedOperatorEvent', event)
}

export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
  let entity = new BeaconUpgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.beacon = event.params.beacon

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('BeaconUpgradedEvent', event)
}

export function handleBorrowerDebtManagementReported(
  event: BorrowerDebtManagementReportedEvent
): void {
  let entity = new BorrowerDebtManagementReported(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.borrower = event.params.borrower
  entity.debtPayment = event.params.debtPayment
  entity.freeFunds = event.params.freeFunds
  entity.fundsGiven = event.params.fundsGiven
  entity.fundsTaken = event.params.fundsTaken
  entity.loss = event.params.loss

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('BorrowerDebtManagementReportedEvent', event)
}

export function handleBurned(event: BurnedEvent): void {
  let entity = new Burned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.amount = event.params.amount
  entity.data = event.params.data
  entity.operatorData = event.params.operatorData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('BurnedEvent', event)
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.caller = event.params.caller
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('DepositEvent', event)
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('InitializedEvent', event)
}

export function handleLockedProfitReleaseRateChanged(
  event: LockedProfitReleaseRateChangedEvent
): void {
  let entity = new LockedProfitReleaseRateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.rate = event.params.rate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('LockedProfitReleaseRateChangedEvent', event)
}

export function handleMinted(event: MintedEvent): void {
  let entity = new Minted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.data = event.params.data
  entity.operatorData = event.params.operatorData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('MintedEvent', event)
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('OwnershipTransferredEvent', event)
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('PausedEvent', event)
}

export function handleRevokedOperator(event: RevokedOperatorEvent): void {
  let entity = new RevokedOperator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.tokenHolder = event.params.tokenHolder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('RevokedOperatorEvent', event)
}

export function handleSent(event: SentEvent): void {
  let entity = new Sent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.data = event.params.data
  entity.operatorData = event.params.operatorData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('SentEvent', event)
}

export function handleStrategyAdded(event: StrategyAddedEvent): void {
  let entity = new StrategyAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategy = event.params.strategy
  entity.debtRatio = event.params.debtRatio

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyAddedEvent', event)
}

export function handleStrategyRemoved(event: StrategyRemovedEvent): void {
  let entity = new StrategyRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategy = event.params.strategy
  entity.fromQueueOnly = event.params.fromQueueOnly

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyRemovedEvent', event)
}

export function handleStrategyReturnedToQueue(
  event: StrategyReturnedToQueueEvent
): void {
  let entity = new StrategyReturnedToQueue(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategy = event.params.strategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyReturnedToQueueEvent', event)
}

export function handleStrategyRevoked(event: StrategyRevokedEvent): void {
  let entity = new StrategyRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategy = event.params.strategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyRevokedEvent', event)
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyRevokedEvent', event)
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyRevokedEvent', event)
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  let vault = Vault.bind(event.address)

  entity.version = vault.version();

  entity.save()

  runApp('StrategyRevokedEvent', event)
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  runApp('StrategyRevokedEvent', event)
}