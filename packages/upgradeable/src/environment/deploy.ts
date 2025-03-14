import { UpgradeOptions } from '@openzeppelin/hardhat-upgrades';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { ProxyCiService } from '../plugins/ProxyCiService';
import { ProxyVerifier } from '../plugins/ProxyVerifier';
import { ImplementationService } from '../plugins/ImplementationService';
import { SafeProxyCiService, needUseSafe } from '../plugins/SafeProxyCiService';
import { Context, DeployResult, Deployer, EtherscanVerifierAdapter } from '../plugins';
import { SafeAdapter } from '../plugins/SafeAdapter';

export const deploy = (hre: HardhatRuntimeEnvironment) => async (
    contractName: string,
    deploymentId: string | null,
    initArgs: unknown[],
    upgradeOptions?: UpgradeOptions
): Promise<DeployResult> => {
    const ctx = new Context(hre, contractName, deploymentId)
    const etherscan = new EtherscanVerifierAdapter(hre)

    let proxy = await ProxyCiService.init(ctx, initArgs, upgradeOptions);
    if (needUseSafe()) {
        const safe = new SafeAdapter(ctx)
        proxy = await SafeProxyCiService.initSafe(ctx, initArgs, etherscan, safe, upgradeOptions)
    }

    const verifier = new ProxyVerifier(ctx, proxy, etherscan)
    const impl = new ImplementationService(ctx, proxy)
    const deployer = new Deployer(ctx, proxy, impl, verifier)

    return await deployer.deploy()
}