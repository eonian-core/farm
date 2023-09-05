import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployResult, Deployment } from 'hardhat-deploy/types'
import type { DeployArgs, DeploymentsService } from '../../LifecycleDeployment.service'
import { DeploymentsAdapter } from '../Deployments.adapter'
import type { Logger } from '../../logger/Logger'
import type { ValidationProvider } from '../../providers'

describe('DeploymentsAdapter', () => {
  let hreMock: HardhatRuntimeEnvironment
  let validationMock: ValidationProvider
  let loggerMock: Logger
  let deploymentsAdapter: DeploymentsService

  beforeEach(() => {
    hreMock = {
      getChainId: jest.fn(async () => 'test-123'),
      deployments: { getNetworkName: jest.fn(async () => 'test-netowork') },
    } as any as HardhatRuntimeEnvironment
    loggerMock = {
      log: jest.fn(),
      warn: jest.fn(),
    } as any
    validationMock = {
      validate: jest.fn(),
    } as any
    deploymentsAdapter = new DeploymentsAdapter(hreMock, validationMock, loggerMock)
  })

  describe('deploy', () => {
    it('should deploy a contract with the provided arguments', async () => {
      const deployArgs: DeployArgs = {
        name: 'TestContract-1',
        contract: 'TestContract',
        deployer: '0x123',
        owner: '0x456',
        init: { args: ['arg1', 'arg2'] },
      }

      const expectedDeployResult: DeployResult = {
        test: 1,
      } as any

      hreMock.deployments = {
        ...hreMock.deployments,
        deploy: jest.fn().mockResolvedValue(expectedDeployResult),
      } as any

      const deployResult = await deploymentsAdapter.deploy(deployArgs)

      expect(hreMock.deployments.deploy).toHaveBeenCalledWith('TestContract-1', {
        contract: 'TestContract',
        from: '0x123',
        log: true,
        gasLimit: 4000000,
        autoMine: true,
        args: [true],
        proxy: {
          owner: '0x456',
          proxyContract: 'ERC1967Proxy',
          proxyArgs: ['{implementation}', '{data}'],
          checkProxyAdmin: false,
          execute: {
            init: {
              methodName: 'initialize',
              args: ['arg1', 'arg2'],
            },
          },
        },
      })
      expect(deployResult).toEqual(expectedDeployResult)
    })

    it('should throw exception if contract and name the same', async () => {
      const deployArgs: DeployArgs = {
        name: 'TestContract',
        contract: 'TestContract',
        deployer: '0x123',
        owner: '0x456',
        init: { args: ['arg1', 'arg2'] },
      }

      const expectedDeployResult: DeployResult = {
        test: 1,
      } as any

      hreMock.deployments = {
        deploy: jest.fn().mockResolvedValue(expectedDeployResult),
      } as any

      const deployResult = await expect(() => deploymentsAdapter.deploy(deployArgs)).rejects.toEqual(
        new Error(`Contract name and artifact name cannot be the same: ${deployArgs.name}`),
      )

      expect(hreMock.deployments.deploy).not.toHaveBeenCalled()
      expect(deployResult).toBeUndefined()
    })

    it('should throw exception if validation failed', async () => {
      const deployArgs: DeployArgs = {
        name: 'TestContract-1',
        contract: 'TestContract',
        deployer: '0x123',
        owner: '0x456',
        init: { args: ['arg1', 'arg2'] },
      }

      hreMock.deployments.deploy = jest.fn()

      validationMock.validate = jest.fn().mockImplementation(() => {
        throw new Error('Generic validation error')
      })

      const deployResult = await expect(() => deploymentsAdapter.deploy(deployArgs)).rejects.toEqual(
        new Error(`Validation failed for "${deployArgs.name}": Generic validation error`),
      )

      expect(hreMock.deployments.deploy).not.toHaveBeenCalled()
      expect(deployResult).toBeUndefined()
    })
  })

  describe('get', () => {
    it('should return the deployment by name if it exists', async () => {
      const deployment: Deployment = {
        test: 1,
      } as any

      hreMock.deployments = {
        get: jest.fn().mockResolvedValue(deployment),
      } as any

      const result = await deploymentsAdapter.get('TestContract')

      expect(hreMock.deployments.get).toHaveBeenCalledWith('TestContract')
      expect(result).toEqual(deployment)
    })

    it('should return undefined if the deployment does not exist', async () => {
      hreMock.deployments = {
        get: jest.fn().mockRejectedValue(new Error('Deployment not found')),
      } as any

      const result = await deploymentsAdapter.get('NonExistentContract')

      expect(hreMock.deployments.get).toHaveBeenCalledWith('NonExistentContract')
      expect(result).toBeUndefined()
      expect(loggerMock.warn).toHaveBeenCalledWith('Probably wasn\'t deployed before', expect.any(Error))
    })
  })

  describe('isDeployed', () => {
    it('should return true if the deployment exists', async () => {
      hreMock.deployments = {
        get: jest.fn().mockResolvedValue({} as Deployment),
      } as any

      const result = await deploymentsAdapter.isDeployed('TestContract')

      expect(hreMock.deployments.get).toHaveBeenCalledWith('TestContract')
      expect(result).toBe(true)
    })

    it('should return false if the deployment does not exist', async () => {
      hreMock.deployments = {
        get: jest.fn().mockResolvedValue(undefined),
      } as any

      const result = await deploymentsAdapter.isDeployed('NonExistentContract')

      expect(hreMock.deployments.get).toHaveBeenCalledWith('NonExistentContract')
      expect(result).toBe(false)
    })
  })
})
