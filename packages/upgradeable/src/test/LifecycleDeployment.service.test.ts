import type { DeployResult, Deployment } from 'hardhat-deploy/types'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployArgs, DeploymentsService } from '../LifecycleDeployment.service'
import { LifecycleDeploymentService } from '../LifecycleDeployment.service'
import type { Logger } from '../logger/Logger'
import { ValidationError } from '../providers'
import type { DeployErrorHandler, ValidationProvider } from '../providers'

describe('LifecycleDeploymentService', () => {
  let dependencies: Deployment[]
  let deployMock: jest.Mock
  let getMock: jest.Mock
  let isDeployedMock: jest.Mock
  let onResolveDependenciesMock: jest.Mock
  let onResolveArgsMock: jest.Mock
  let afterDeployMock: jest.Mock
  let afterUpgradeMock: jest.Mock
  let deployments: DeploymentsService
  let logger: Logger
  let args: DeployArgs
  let hreMock: HardhatRuntimeEnvironment
  let validationMock: ValidationProvider
  let deployErrorHandler: DeployErrorHandler
  let service: LifecycleDeploymentService

  class TestImplmenetation extends LifecycleDeploymentService {
    async onResolveDependencies(): Promise<Deployment[]> {
      return onResolveDependenciesMock()
    }

    async onResolveArgs(dependencies: Deployment[]): Promise<DeployArgs> {
      return onResolveArgsMock(dependencies)
    }

    async afterDeploy(result: DeployResult): Promise<void> {
      return afterDeployMock(result)
    }

    async afterUpgrade(result: DeployResult): Promise<void> {
      return afterUpgradeMock(result)
    }
  }

  beforeEach(() => {
    deployMock = jest.fn()
    getMock = jest.fn()
    isDeployedMock = jest.fn()
    dependencies = ['test'] as any
    onResolveDependenciesMock = jest.fn(() => dependencies)
    deployments = {
      deploy: deployMock,
      get: getMock,
      isDeployed: isDeployedMock,
    }
    args = {
      name: 'TestContract',
      contract: '0xabc',
      deployer: '0x123',
      owner: '0x456',
      init: { args: ['arg1', 'arg2'] },
    }
    onResolveArgsMock = jest.fn(() => args)
    afterDeployMock = jest.fn()
    afterUpgradeMock = jest.fn()
    hreMock = {} as any
    validationMock = { validate: jest.fn(), saveImplementationData: jest.fn() } as any
    deployErrorHandler = { handleDeployError: jest.fn(), network: { name: 'test' } } as any

    logger = { log: jest.fn(), warn: jest.fn(), debug: jest.fn() } as any

    service = new TestImplmenetation(hreMock, deployments, logger, validationMock, deployErrorHandler)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should correctly deploy contract', async () => {
    isDeployedMock.mockResolvedValue(false)
    const deployResult: DeployResult = {} as any
    deployMock.mockResolvedValue(deployResult)

    await service.deploy()

    expect(onResolveDependenciesMock).toHaveBeenCalledTimes(1)
    expect(onResolveArgsMock).toHaveBeenCalledWith(dependencies)
    expect(isDeployedMock).toHaveBeenCalledWith(args.name)
    expect(deployMock).toHaveBeenCalledWith(args)
    expect(afterDeployMock).toHaveBeenCalledWith(deployResult)
    expect(afterUpgradeMock).not.toHaveBeenCalled()
  })

  it('should correctly upgrade contract', async () => {
    isDeployedMock.mockResolvedValue(true)
    const deployResult: DeployResult = {} as any
    deployMock.mockResolvedValue(deployResult)

    await service.deploy()

    expect(onResolveDependenciesMock).toHaveBeenCalledTimes(1)
    expect(onResolveArgsMock).toHaveBeenCalledWith(dependencies)
    expect(isDeployedMock).toHaveBeenCalledWith(args.name)
    expect(deployMock).toHaveBeenCalledWith(args)
    expect(afterDeployMock).not.toHaveBeenCalled()
    expect(afterUpgradeMock).toHaveBeenCalledWith(deployResult)
  })

  it('should throw exception if validation failed', async () => {
    const deployResult: DeployResult = {} as any
    deployMock.mockResolvedValue(deployResult)

    validationMock.validate = jest.fn().mockImplementation(() => {
      throw new ValidationError('Generic validation error')
    })

    await service.deploy()

    expect(deployErrorHandler.handleDeployError).toHaveBeenCalledWith(
      new ValidationError('Generic validation error'), 'TestContract',
    )
    expect(deployMock).not.toHaveBeenCalled()
  })
})
