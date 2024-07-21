import debug from 'debug'

import { DeployStatus } from './DeployState'
import { Context, WithLogger } from './Context'
import { ProxyCiService } from './ProxyCiService'
import { ImplementationService } from './ImplementationService'
import { ProxyVerifier } from './ProxyVerifier'

export interface DeployResult {
  contractName: string
  deploymentId: string | null
  proxyAddress: string
  implementationAddress?: string
  status: DeployStatus
  verified?: boolean
}

export class Deployer extends WithLogger {
  constructor(
    ctx: Context,
    private proxy: ProxyCiService,
    private impl: ImplementationService,
    private verifier: ProxyVerifier,
  ) {
    super(ctx, debug(Deployer.name))
  }

  protected async executePreDeployHook(): Promise<void> {
    const onBeforeDeploy = this.hre.onBeforeDeploy
    if (onBeforeDeploy) {
      await onBeforeDeploy(this.contractName, this.deploymentId)
    }
  }

  /**
   * Performs deployment and upgrade for the specified contract only if required.
   * Deployment will only be performed if the specified deployment ID is not found in the deployment data (@see DeploymentData).
   * Upgrade will only be executed if the contract bytecode has been changed.
   * Otherwise, no actual transactions will be executed.
   * @returns The result of the deploy (@see DeployResult).
   */
  public async deploy(): Promise<DeployResult> {
    await this.executePreDeployHook()

    this.log(`Try retrive proxy address from the cache (deployment data file), if not, will deploys a new proxy...`)
    const proxyAddress = (await this.proxy.findProxyInCache()) ?? await this.proxy.deployProxy();
    this.log(`Proxy retrived: ${proxyAddress}`)

    this.log(`Checking if implementation for proxy "${proxyAddress}" in codebase has been changed, will deploy new if changed...`)
    const { isChanged, implementationAddress } = await this.impl.isImplementationChanged(proxyAddress)
    if (isChanged) {
      this.log(`Implementation for proxy "${proxyAddress}" has been changed, will upgrade...`)
      await this.proxy.upgradeProxy(proxyAddress)
    }

    return (this.hre.lastDeployments[proxyAddress] = {
      proxyAddress,
      implementationAddress,
      contractName: this.contractName,
      deploymentId: this.deploymentId,
      status: this.proxy.state.status,
      verified: await this.verifier.verifyProxyAndImplIfNeeded(proxyAddress, this.proxy.upgradeOptions.constructorArgs || []),
    })
  }
}
