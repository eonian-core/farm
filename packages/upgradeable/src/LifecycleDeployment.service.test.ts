
import { DeployResult } from '@eonian/hardhat-deploy/types';
import { DeployArgs, LifecycleDeploymentService, DeploymentsService } from './LifecycleDeployment.service';

describe('LifecycleDeploymentService', () => {
    let deployMock: jest.Mock;
    let getMock: jest.Mock;
    let isDeployedMock: jest.Mock;
    let deployments: DeploymentsService;
    let args: DeployArgs;
    let service: LifecycleDeploymentService;

    beforeEach(() => {
        deployMock = jest.fn();
        getMock = jest.fn();
        isDeployedMock = jest.fn();
        deployments = { deploy: deployMock, get: getMock, isDeployed: isDeployedMock };
        args = {
            name: 'TestContract',
            deployer: '0x123',
            owner: '0x456',
            init: { args: ['arg1', 'arg2'] },
        };
        service = new LifecycleDeploymentService(deployments, args);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly deploy contract', async () => {
        isDeployedMock.mockResolvedValue(false);
        const deployResult: DeployResult = {  } as any;
        deployMock.mockResolvedValue(deployResult);

        await service.deploy();

        expect(isDeployedMock).toHaveBeenCalledWith(args.name);
        expect(deployMock).toHaveBeenCalledWith(args);
    });

    it('should correctly upgrade contract', async () => {
        isDeployedMock.mockResolvedValue(true);
        const deployResult: DeployResult = {  } as any;
        deployMock.mockResolvedValue(deployResult);

        await service.deploy();

        expect(isDeployedMock).toHaveBeenCalledWith(args.name);
        expect(deployMock).toHaveBeenCalledWith(args);
    });

    // Add more test cases here as needed
});
