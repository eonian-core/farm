
import { ZeroAddress } from 'ethers'

import { ProxyValidator } from '../ProxyValidator'
import { DeployStatus } from '../DeployState'
import { mockHre } from '../test-utils/mockHre'

const addressA = '0x0000000000000000000000000000000000000001'
const addressB = '0x0000000000000000000000000000000000000002'

describe('ProxyValidator', () => {
  it('Should throw if no deployments were made', async () => {
    const hre = await mockHre()

    const validator = new ProxyValidator(hre)
    await expect(validator.validateLastDeployments()).rejects.toThrow()
  })

  it('Should not throw if all deployments were skipped', async () => {
    const hre = await mockHre({
      lastDeployments: {
        [addressA]: { status: DeployStatus.NONE },
      },
    })
    const validator = new ProxyValidator(hre)
    await validator.validateLastDeployments()
  })

  it('Should validate that proxies are in sync', async () => {
    const hre = await mockHre({
      lastDeployments: {
        [addressA]: { status: DeployStatus.UPGRADED, implementation: ZeroAddress },
        [addressB]: { status: DeployStatus.DEPLOYED, implementation: ZeroAddress },
      },
    })
    const validator = new ProxyValidator(hre)
    validator.validateThatProxiesAreInSync()
  })

  it('Should throw if proxies are not in sync', async () => {
    const hre = await mockHre({
      lastDeployments: {
        [addressA]: { status: DeployStatus.UPGRADED, implementation: ZeroAddress },
        [addressB]: { status: DeployStatus.DEPLOYED, implementation: addressA },
      },
    })
    const validator = new ProxyValidator(hre)
    expect(() => validator.validateThatProxiesAreInSync()).toThrow(Error)
  })

  it('Should validate that proxies are registered', async () => {
    const hre = await mockHre({
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
    const hre = await mockHre({
      lastDeployments: {
        [addressA]: { status: DeployStatus.DEPLOYED },
        [addressB]: { status: DeployStatus.DEPLOYED },
      },
      inRegister: [addressB],
      inManifest: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await expect(validator.validateThatProxiesWereSaved()).rejects.toThrow()
  })

  it('Should validate that proxy is in register', async () => {
    const hre = await mockHre({
      inRegister: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await validator.validateThatProxiesWereSavedInRegister([{ proxyAddress: addressA } as any])
  })

  it('Should throw if proxy is not in register', async () => {
    const hre = await mockHre({
      inRegister: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await expect(validator.validateThatProxiesWereSavedInRegister([{ proxyAddress: addressB } as any])).rejects.toThrow()
  })

  it('Should validate that proxy is in OZ Manifest', async () => {
    const hre = await mockHre({
      inManifest: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await validator.validateThatProxiesWereSavedInManifest([{ proxyAddress: addressA }] as any)
  })

  it('Should throw if proxy is not in OZ Manifest', async () => {
    const hre = await mockHre({
      inManifest: [addressA],
    })
    const validator = new ProxyValidator(hre)
    await expect(validator.validateThatProxiesWereSavedInManifest([{ proxyAddress: addressB }] as any)).rejects.toThrow()
  })
})

