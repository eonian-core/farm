import debug from 'debug'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { UpgradeOptions, DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import type { UpgradeProposalResponse } from '@openzeppelin/hardhat-upgrades/dist/defender/propose-upgrade-with-approval'
import { DeployStatus } from './DeployState'
import { BaseDeployer } from './BaseDeployer'
import { sendTxWithRetry } from '../sendTxWithRetry'
import { DeployResult } from './Deployer'

export const needUseDefender = () => process.env.OPENZEPPLIN_DEFENDER_DEPLOY === 'true'

export interface DefenderDeployResult {
    contractName: string
    deploymentId: string | null
    proxyAddress?: string
    implementationAddress?: string
    status: DeployStatus
}

export class DefenderDeployer extends BaseDeployer {

    // TODO: move to args
    private deployOptions: DeployProxyOptions = {
        useDefenderDeploy: true,
        verifySourceCode: true,
        // SMART_CONTRACTS_LICENSE_TYPE also used in contracts/check-license.js script
        licenseType: process.env.SMART_CONTRACTS_LICENSE_TYPE || 'GNU AGPLv3' as any,
        constructorArgs: [true], // Disable initializers,
        salt: process.env.OPENZEPPLIN_DEFENDER_SALT
    }

    constructor(
        hre: HardhatRuntimeEnvironment,
        contractName: string,
        deploymentId: string | null,
        private initArgs: unknown[],
        private upgradeOptions: UpgradeOptions = { constructorArgs: [true] } // Disable initializers
    ) {
        super(debug(DefenderDeployer.name), hre, contractName, deploymentId)
        this.upgradeOptions = {
            kind: 'uups',
            redeployImplementation: 'onchange',
            ...this.upgradeOptions,
        }
    }

    public async deploy(): Promise<DeployResult> {
        await this.executePreDeployHook()

        // Returns the proxy address from the cache (deployment data file) or deploys a new proxy first.
        const proxyAddress = (await this.findProxyInCache()) ?? await this.deployProxy();
        this.log(`Proxy address: ${proxyAddress}`)

        const oldImplAddress = await this.getImplementation(proxyAddress)
        const proposal = await this.deployImplementationIfNeeded(proxyAddress)
        this.log(`Old implementation: "${oldImplAddress}", new implementation proposal id: "${proposal.proposalId}"`)

        return (this.hre.lastDeployments[proxyAddress] = {
            proxyAddress,
            contractName: this.contractName,
            deploymentId: this.deploymentId,
            status: this.state.status
        })
    }

    /**
     * Deploys a new proxy and implementation contract. Saves the proxy address to the deployment data file.
     * @returns The address of the proxy contract.
     */
    private async deployProxy(): Promise<string> {
        this.log('Starting proxy deployment...')

        const defenderProcess = await this.hre.defender.getUpgradeApprovalProcess();
        if (!defenderProcess.address) {
            throw new Error(`OpenZepplin Defender upgrade approval process with id ${defenderProcess.approvalProcessId} has no assigned address`)
        }
        this.log(`Resolved OpenZeppelin Defender approval process address: ${defenderProcess.address}`)

        const deployment = await this.hre.defender.deployProxy(await this.getContractFactory(), this.initArgs, this.deployOptions);
        await deployment.waitForDeployment()
        const address = await deployment.getAddress()
        this.log(`Succesfully deployed proxy to "${address}"`)

        await this.hre.proxyRegister.saveProxy(this.contractName, this.deploymentId, address)
        this.log(`Proxy with address "${address}" saved to the deployment data file...`)

        this.state.switchTo(DeployStatus.DEPLOYED)

        this.log(`Transfer ownership to the OpenZepplin Defender approval process address ${defenderProcess.address}...`)
        const proxy = await this.hre.ethers.getContractAt(this.contractName, address)
        // expect that the contract implements Ownable interface
        if (!proxy.transferOwnership) {
            throw new Error(`Contract ${this.contractName} at address ${address} does not implement transferOwnership method, usally defined in Ownable base contract`)
        }
        await sendTxWithRetry(async () => await proxy.transferOwnership(defenderProcess.address!))
        this.log(`Ownership transfered to ${defenderProcess.address}`)

        return address
    }

    /**
     * Validates the implementation contract and deploys it if required (if the byte code has been changed).
     * (!) This function doesn't set the implementation address of the proxy.
     * @param proxyAddress The proxy address to get the current implementation from.
     * @returns Implementation address. Returns the current implementation of the proxy if no deployment has been made.
     */
    private async deployImplementationIfNeeded(proxyAddress: string): Promise<UpgradeProposalResponse> {
        this.log('Checking and deploy new implementation if needed...')
        
        const proposal = await this.hre.defender.proposeUpgradeWithApproval(proxyAddress, await this.getContractFactory(), this.upgradeOptions)
        this.log(`Upgrade proposed with URL: ${proposal.url}`)
        
        return proposal
    }
}