import { newMockEvent } from 'matchstick-as'
import { Address, ethereum } from '@graphprotocol/graph-ts'
import {
  AdminChanged,
  BeaconUpgraded,
  Upgraded,
} from '../generated/Vault/Vault'

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address,
): AdminChanged {
  const adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = []

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      'previousAdmin',
      ethereum.Value.fromAddress(previousAdmin),
    ),
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam('newAdmin', ethereum.Value.fromAddress(newAdmin)),
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  const beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = []

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam('beacon', ethereum.Value.fromAddress(beacon)),
  )

  return beaconUpgradedEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  const upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = []

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      'implementation',
      ethereum.Value.fromAddress(implementation),
    ),
  )

  return upgradedEvent
}
