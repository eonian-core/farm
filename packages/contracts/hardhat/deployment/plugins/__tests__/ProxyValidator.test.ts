import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Manifest } from '@openzeppelin/upgrades-core'
import { ZeroAddress, ZeroHash } from 'ethers'
import { expect } from 'chai'
import _ from 'lodash'
import { ProxyValidator } from '../ProxyValidator'
import { DeployStatus } from '../Deployer'

const addressA = '0x0000000000000000000000000000000000000001'
const addressB = '0x0000000000000000000000000000000000000002'

describe('ProxyValidator', () => {
  it('Should throw if no deployments were made', async () => {
    const hre = await createHRE()

    const validator = new ProxyValidator(hre)
    await expect(validator.validateLastDeployments()).to.be.rejectedWith(Error)
  })

  it('Should not throw if all deployments were skipped', async () => {
    const hre = await createHRE({
      lastDeployments: {
        [addressA]: { status: DeployStatus.NONE },
      },
    })
    const validator = new ProxyValidator(hre)
    await validator.validateLastDeployments()
  })

  it('Should validate that proxies are in sync', async () => {
    const hre = await createHRE({
      lastDeployments: {
        [addressA]: { status: DeployStatus.UPGRADED, implementation: ZeroAddress },
        [addressB]: { status: DeployStatus.DEPLOYED, implementation: ZeroAddress },
      },
    })
    const validator = new ProxyValidator(hre)
    validator.validateThatProxiesAreInSync()
  })

  it('Should throw if proxies are not in sync', async () => {
    const hre = await createHRE({
      lastDeployments: {
        [addressA]: { status: DeployStatus.UPGRADED, implementation: ZeroAddress },
        [addressB]: { status: DeployStatus.DEPLOYED, implementation: addressA },
      },
    })
    const validator = new ProxyValidator(hre)
    expect(() => validator.validateThatProxiesAreInSync()).to.throw(Error)
  })

  it('Should validate that proxies are registered', async () => {
    const hre = await createHRE({
      lastDeployments: {
        [addressA]: { status: DeployStatus.DEPLOYED },
        [addressB]: { status: DeployStatus.DEPLOYED },
      },
      inRegister: [addressA, addressB],
      inManifest: [addressA, addressB],
    })
    const validator = new ProxyValidator(hre)
    await validator.validateThatProxiesWereSaved()
  })

  it('Should throw if proxies are not registered', async () => {
    const hre = await createHRE({
      lastDeployments: {
        [addressA]: { status: DeployStatus.DEPLOYED },
        [addressB]: { status: DeployStatus.DEPLOYED },
      },
      inRegister: [addressB],
      inManifest: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await expect(validator.validateThatProxiesWereSaved()).to.be.rejectedWith(Error)
  })

  it('Should validate that proxy is in register', async () => {
    const hre = await createHRE({
      inRegister: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await validator.validateThatProxiesWereSavedInRegister([{ proxyAddress: addressA } as any])
  })

  it('Should throw if proxy is not in register', async () => {
    const hre = await createHRE({
      inRegister: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await expect(validator.validateThatProxiesWereSavedInRegister([{ proxyAddress: addressB } as any])).to.be.rejectedWith(Error)
  })

  it('Should validate that proxy is in OZ Manifest', async () => {
    const hre = await createHRE({
      inManifest: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await validator.validateThatProxiesWereSavedInManifest([{ proxyAddress: addressA }] as any)
  })

  it('Should throw if proxy is not in OZ Manifest', async () => {
    const hre = await createHRE({
      inManifest: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await expect(validator.validateThatProxiesWereSavedInManifest([{ proxyAddress: addressB }] as any)).to.be.rejectedWith(Error)
  })
})

interface CreateHREOptions {
  lastDeployments?: Record<string, { status: DeployStatus; implementation?: string }>
  inRegister?: string[]
  inManifest?: string[]
}

async function createHRE(options: CreateHREOptions = {}): Promise<HardhatRuntimeEnvironment> {
  const chainId = Math.floor(Math.random() * 1000)
  const chainIdHex = chainId.toString(16)
  const lastDeployments = _.mapValues(options.lastDeployments ?? {}, (data, address) => {
    return {
      proxyAddress: address,
      deploymentId: null,
      implementationAddress: data.implementation ?? ZeroAddress,
      status: data.status,
      verified: false,
      contractName: 'Contract',
    }
  })
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
