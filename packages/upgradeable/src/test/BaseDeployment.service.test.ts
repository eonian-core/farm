import type { Address, DeployResult, Deployment } from 'hardhat-deploy/types'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployArgs, DeploymentsService } from '../LifecycleDeployment.service'
import type { Logger } from '../logger/Logger'
import type {
  AccountsService,
  BaseDeploymentConfig,
  DependenciesService,
  EnvironmentService,
  NamedAccounts,
} from '../BaseDeployment.service'
import {
  BaseDeploymentService,
  Stage,
} from '../BaseDeployment.service'

describe('BaseDeploymentService', () => {
  let config: BaseDeploymentConfig
  let dependenciesServiceMock: DependenciesService
  let accountsServiceMock: AccountsService
  let deploymentsServiceMock: DeploymentsService
  let loggerMock: Logger
  let enironmentMock: EnvironmentService
  let baseDeploymentService: BaseDeploymentService
  let hreMock: HardhatRuntimeEnvironment

  beforeEach(() => {
    config = {
      contract: 'TestContract',
      tags: ['Tag1', 'Tag2'],
      dependencies: ['Dependency1', 'Dependency2'],
    }
    dependenciesServiceMock = {
      resolve: jest.fn(),
    } as DependenciesService
    accountsServiceMock = {
      get: jest.fn(),
    } as AccountsService
    deploymentsServiceMock = {} as DeploymentsService
    loggerMock = {} as Logger
    enironmentMock = {
      getStage: jest.fn(async () => Stage.Development),
    } as EnvironmentService
    hreMock = {} as HardhatRuntimeEnvironment
    baseDeploymentService = new BaseDeploymentService(
      config,
      dependenciesServiceMock,
      accountsServiceMock,
      enironmentMock,
      hreMock,
      deploymentsServiceMock,
      loggerMock,
    )
  })

  describe('constructor', () => {
    it('should throw an error if config tags array is empty', () => {
      config.tags = []

      expect(() => {
        // eslint-disable-next-line no-new
        new BaseDeploymentService(
          config,
          dependenciesServiceMock,
          accountsServiceMock,
          enironmentMock,
          hreMock,
          deploymentsServiceMock,
          loggerMock,
        )
      }).toThrow('Contract must have at least one tag')
    })
  })

  describe('onResolveDependencies', () => {
    it('should call dependencies service resolve method with the correct dependencies', async () => {
      const dependencies: Deployment[] = [{ name: 'Dependency1' }, { name: 'Dependency2' }] as any;
      (dependenciesServiceMock.resolve as jest.Mock).mockResolvedValue(dependencies)

      const result = await baseDeploymentService.onResolveDependencies()

      expect(dependenciesServiceMock.resolve).toHaveBeenCalledWith(['Dependency1', 'Dependency2'])
      expect(result).toEqual(dependencies)
    })
  })

  describe('onResolveArgs', () => {
    it('should return the correct DeployArgs object', async () => {
      const deployer: Address = '0x123'

      const accounts: NamedAccounts = {
        deployer,
      }
      const dependencies: Deployment[] = [{ name: 'Dependency1' }, { name: 'Dependency2' }] as any;
      (accountsServiceMock.get as jest.Mock).mockResolvedValue(accounts)
      baseDeploymentService.onResolveInitArgs = jest.fn().mockResolvedValue(['arg1', 'arg2'])

      const result = await baseDeploymentService.onResolveArgs(dependencies)

      expect(accountsServiceMock.get).toHaveBeenCalled()
      expect(baseDeploymentService.onResolveInitArgs).toHaveBeenCalledWith({
        accounts,
        stage: Stage.Development,
        dependencies,
      })
      expect(result).toEqual<DeployArgs>({
        name: 'TestContract|Tag1|Tag2',
        contract: 'TestContract',
        deployer,
        owner: deployer,
        init: {
          args: ['arg1', 'arg2'],
        },
      })
    })
  })

  describe('generateContractName', () => {
    it('should return the correct contract name', () => {
      const result = baseDeploymentService.generateContractName()

      expect(result).toBe('TestContract|Tag1|Tag2')
    })
  })

  describe('onResolveInitArgs', () => {
    it('should return an empty array by default', async () => {
      const accounts: NamedAccounts = {
        deployer: '0x123',
      }
      const dependencies: Deployment[] = []

      const result = await baseDeploymentService.onResolveInitArgs({
        accounts,
        stage: Stage.Production,
        dependencies,
      })

      expect(result).toEqual([])
    })
  })

  describe('afterDeploy', () => {
    it('should not throw an error and can be overridden', async () => {
      const deployResult: DeployResult = {
        test: 1,
      } as any

      await expect(baseDeploymentService.afterDeploy(deployResult, [])).resolves.not.toThrow()
    })
  })

  describe('afterUpgrade', () => {
    it('should not throw an error and can be overridden', async () => {
      const deployResult: DeployResult = {
        test: 1,
      } as any

      await expect(baseDeploymentService.afterUpgrade(deployResult, [])).resolves.not.toThrow()
    })
  })
})
