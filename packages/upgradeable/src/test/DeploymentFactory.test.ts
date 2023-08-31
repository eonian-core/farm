import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { BaseDeploymentService } from '../BaseDeployment.service'
import type { DeployConfig, IDependenciesContainer } from '../DeploymentFactory'
import { DeploymentFactory } from '../DeploymentFactory'

describe('DeploymentFactory', () => {
  let containerMock: IDependenciesContainer<DeployConfig, BaseDeploymentService>
  let deploymentFactory: DeploymentFactory<DeployConfig, BaseDeploymentService>
  let deployMock = jest.fn()

  class TestDeploymentService {
    async deploy(): Promise<void> {
      return deployMock()
    }
  }

  beforeEach(() => {
    containerMock = {
      resolve: jest.fn(() => new TestDeploymentService() as any),
    } as IDependenciesContainer<DeployConfig, BaseDeploymentService>
    deploymentFactory = new DeploymentFactory(containerMock)

    deployMock = jest.fn()
  })

  describe('build', () => {
    it('should return a deploy function with the correct tags and skip function', async () => {
      const config: DeployConfig = {
        contract: 'TestContract',
        tags: ['Tag1', 'Tag2'],
        chains: ['chain1', 'chain2'],
      }
      const serviceClass = TestDeploymentService as any

      const deployFunction = deploymentFactory.build(config, serviceClass)

      expect(deployFunction).toBeInstanceOf(Function)
      expect(deployFunction.tags).toEqual(['TestContract', 'chain1', 'chain2', 'Tag1', 'Tag2'])
      expect(deployFunction.skip).toBeInstanceOf(Function)

      expect(
        await deployFunction.skip!({
          network: {
            config: {
              tags: ['chain1'],
            },
          },
        } as any),
      ).toBe(false)
      expect(
        await deployFunction.skip!({
          network: {
            config: {
              tags: ['chain3'],
            },
          },
        } as any),
      ).toBe(true)

      expect(containerMock.resolve).not.toHaveBeenCalled()
      expect(deployMock).not.toHaveBeenCalled()

      const hre = { test: 1 } as any as HardhatRuntimeEnvironment
      await deployFunction(hre)

      expect(containerMock.resolve).toHaveBeenCalledWith(serviceClass, config, hre)
      expect(deployMock).toHaveBeenCalled()
    })
  })

  describe('skip', () => {
    it('should return a skip function that returns true if none of the contract chains match the network', async () => {
      const contractChains = ['chain1', 'chain2']
      const network = {
        config: {
          tags: ['chain3', 'chain4'],
        },
      } as unknown as HardhatRuntimeEnvironment['network']

      const skipFunction = deploymentFactory.skip(contractChains)

      const result = await skipFunction({ network } as any)

      expect(result).toBe(true)
    })

    it('should return a skip function that returns false if at least one of the contract chains match the network', async () => {
      const contractChains = ['chain1', 'chain2']
      const network = {
        config: {
          tags: ['chain1', 'chain3'],
        },
      } as unknown as HardhatRuntimeEnvironment['network']

      const skipFunction = deploymentFactory.skip(contractChains)

      const result = await skipFunction({ network } as any)

      expect(result).toBe(false)
    })
  })
})
