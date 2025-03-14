import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ZeroAddress, ZeroHash } from 'ethers'
import { Manifest } from '@openzeppelin/upgrades-core'
import { DeployStatus } from '../DeployState'

interface CreateHREOptions {
    lastDeployments?: Record<string, { status: DeployStatus; implementation?: string }>
    inRegister?: string[]
    inManifest?: string[]
}

export async function mockHre(options: CreateHREOptions = {}): Promise<HardhatRuntimeEnvironment> {
    const chainId = Math.floor(Math.random() * 1000)
    const chainIdHex = chainId.toString(16)
    const lastDeployments = Object.keys(options.lastDeployments ?? {}).reduce((result, address) => {
        const data = options.lastDeployments?.[address]
        return {
            ...result,
            [address]: {
                proxyAddress: address,
                deploymentId: null,
                implementationAddress: data?.implementation ?? ZeroAddress,
                status: data?.status,
                verified: false,
                contractName: 'Contract',
            }
        }
    }, {})

    const hre = {
        lastDeployments,
        proxyRegister: {
            getAll: () => Promise.resolve((options.inRegister ?? []).map(address => ({ address }) as any)),
        } as any,
        ethers: {
            provider: {
                send: (opcode: string) => {
                    switch (opcode) {
                        case 'eth_chainId': return Promise.resolve(chainIdHex)
                        case 'anvil_metadata': return Promise.resolve({ chainId })
                    }
                },
            },
        },
    } as HardhatRuntimeEnvironment

    if (options.inManifest && options.inManifest.length > 0) {
        const manifest = await Manifest.forNetwork(hre.ethers.provider)
        for (const address of options.inManifest) {
            await manifest.addProxy({ address, kind: 'uups', txHash: ZeroHash })
        }
    }

    return hre
}
