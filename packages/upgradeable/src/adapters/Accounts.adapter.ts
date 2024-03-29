/// <reference path="../types.d.ts"/>
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { AccountsService, NamedAccounts } from '../BaseDeployment.service'

export class AccountsAdapter implements AccountsService {
  constructor(readonly hre: HardhatRuntimeEnvironment) {}

  async get(): Promise<NamedAccounts> {
    const { getNamedAccounts } = this.hre

    const accounts = (await getNamedAccounts()) as NamedAccounts

    if (!accounts.deployer) {
      throw new Error('Deployer account not found')
    }

    return accounts
  }
}
