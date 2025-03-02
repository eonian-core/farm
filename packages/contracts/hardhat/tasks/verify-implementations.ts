/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { ProxyCiService, ProxyRecord } from '@eonian/upgradeable'
import { Context, EtherscanVerifierAdapter, ProxyVerifier } from '@eonian/upgradeable'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'

/**
 * Example:
 * $ hardhat verify-contracts \
 *  --network bsc_mainnet_dev \
 *  --contracts ApeLendingStrategy,AaveSupplyStrategy
 */
task('verify-contracts', 'Verifes implementation contracts on etherscan-like explorers')
  .addOptionalParam('contracts', 'Comma-separated contract names to verify', '')
  .setAction(async (taskArgs, hre) => {
    const proxies = await hre.proxyRegister.getAll()
    const rawContractNames = String(taskArgs.contracts) || _.chain(proxies).map('contractName').uniq().join().value()
    const contractNames = rawContractNames.split(',')
    for (const proxy of proxies) {
      if (!contractNames.includes(proxy.contractName)) {
        continue
      }
      await verify(hre, proxy)
    }
  })

async function verify(hre: HardhatRuntimeEnvironment, proxy: ProxyRecord) {
  const context = new Context(hre, proxy.contractName, proxy.id)
  const etherscan = new EtherscanVerifierAdapter(hre)
  const proxyService = {
    getImplementation: () => Promise.resolve(proxy.implementationAddress),
  } as unknown as ProxyCiService
  const verifier = new ProxyVerifier(context, proxyService, etherscan)
  await verifier.verifyProxyAndImplIfNeeded(proxy.address, [true])
}
