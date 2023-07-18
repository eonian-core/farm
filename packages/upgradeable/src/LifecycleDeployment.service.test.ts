
import { DeployResult, Deployment } from '@eonian/hardhat-deploy/types';
import { DeployArgs, LifecycleDeploymentService, DeploymentsService } from './LifecycleDeployment.service';

describe(LifecycleDeploymentService.name, () => {
    let dependencies: Deployment[];
    let deployMock: jest.Mock;
    let getMock: jest.Mock;
    let isDeployedMock: jest.Mock;
    let onResolveDependenciesMock: jest.Mock;
    let onResolveArgsMock: jest.Mock;
    let afterDeployMock: jest.Mock;
    let afterUpgradeMock: jest.Mock;
    let deployments: DeploymentsService;
    let args: DeployArgs;
    let service: LifecycleDeploymentService;

    class TestImplmenetation extends LifecycleDeploymentService {
        async onResolveDependencies(): Promise<Deployment[]> {
            return onResolveDependenciesMock();
        }
        async onResolveArgs(dependencies: Deployment[]): Promise<DeployArgs> {
            return onResolveArgsMock(dependencies);
        }
        async afterDeploy(result: DeployResult): Promise<void> {
            return afterDeployMock(result);
        }
        async afterUpgrade(result: DeployResult): Promise<void> {
            return afterUpgradeMock(result);
        }
    }

    beforeEach(() => {
        deployMock = jest.fn();
        getMock = jest.fn();
        isDeployedMock = jest.fn();
        dependencies = [ "test" ] as any;
        onResolveDependenciesMock = jest.fn(() => dependencies);
        deployments = { deploy: deployMock, get: getMock, isDeployed: isDeployedMock };
        args = {
            name: 'TestContract',
            deployer: '0x123',
            owner: '0x456',
            init: { args: ['arg1', 'arg2'] },
        };
        onResolveArgsMock = jest.fn(() => args);
        afterDeployMock = jest.fn();
        afterUpgradeMock = jest.fn();
        service = new TestImplmenetation(deployments);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly deploy contract', async () => {
        isDeployedMock.mockResolvedValue(false);
        const deployResult: DeployResult = {  } as any;
        deployMock.mockResolvedValue(deployResult);

        await service.deploy();

        expect(onResolveDependenciesMock).toHaveBeenCalledTimes(1);
        expect(onResolveArgsMock).toHaveBeenCalledWith(dependencies);
        expect(isDeployedMock).toHaveBeenCalledWith(args.name);
        expect(deployMock).toHaveBeenCalledWith(args);
        expect(afterDeployMock).toHaveBeenCalledWith(deployResult);
        expect(afterUpgradeMock).not.toHaveBeenCalled();
    });

    it('should correctly upgrade contract', async () => {
        isDeployedMock.mockResolvedValue(true);
        const deployResult: DeployResult = {  } as any;
        deployMock.mockResolvedValue(deployResult);

        await service.deploy();

        expect(onResolveDependenciesMock).toHaveBeenCalledTimes(1);
        expect(onResolveArgsMock).toHaveBeenCalledWith(dependencies);
        expect(isDeployedMock).toHaveBeenCalledWith(args.name);
        expect(deployMock).toHaveBeenCalledWith(args);
        expect(afterDeployMock).not.toHaveBeenCalled();
        expect(afterUpgradeMock).toHaveBeenCalledWith(deployResult);
    });

    // Add more test cases here as needed
});
