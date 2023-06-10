import {
  AdminChanged as AdminChangedEvent,
  BeaconUpgraded as BeaconUpgradedEvent,
  Upgraded as UpgradedEvent
} from "../generated/Vault/Vault"
import { AdminChanged, BeaconUpgraded, Upgraded, SavebleEntity } from "../generated/schema"

import { log } from "matchstick-as/assembly/log";

/** Save entity at the end of transaction */
function withEntity<T, E>(entity: T, event: E, callback: (entity: T, event: E) => void): void {
  callback(entity, event);
  (entity as SavebleEntity).save();
}

export function handleAdminChanged(event: AdminChangedEvent): void {
  const id = event.transaction.hash.concatI32(event.logIndex.toI32())
  log.info("handleAdminChanged: " + id.toHexString(), [])

  withEntity(new AdminChanged(id), event, (entity, event) => {
    entity.previousAdmin = event.params.previousAdmin
    entity.newAdmin = event.params.newAdmin
  
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
  })
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
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
