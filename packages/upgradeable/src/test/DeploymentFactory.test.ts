import { DeployFunction } from "@eonian/hardhat-deploy/types";
import { BaseDeploymentConfig, BaseDeploymentService } from "../BaseDeployment.service";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DeployConfig,
  SkipFunction,
  DependenciesContainer,
  DeploymentFactory,
} from "../DeploymentFactory";

describe("DeploymentFactory", () => {
  let containerMock: DependenciesContainer<DeployConfig, BaseDeploymentService>;
  let deploymentFactory: DeploymentFactory<DeployConfig, BaseDeploymentService>;

  beforeEach(() => {
    containerMock = {
      resolve: jest.fn(),
    } as DependenciesContainer<DeployConfig, BaseDeploymentService>;
    deploymentFactory = new DeploymentFactory(containerMock);
  });

  describe("build", () => {
    it("should return a deploy function with the correct tags and skip function", async () => {
      const config: DeployConfig = {
        contract: "TestContract",
        tags: ["Tag1", "Tag2"],
        chains: ["chain1", "chain2"],
      };
      const serviceClass = BaseDeploymentService;

      const deployFunction = deploymentFactory.build(config, serviceClass);

      expect(deployFunction).toBeInstanceOf(Function);
      expect(deployFunction.tags).toEqual([
        "TestContract",
        "chain1",
        "chain2",
        "Tag1",
        "Tag2",
      ]);
      expect(deployFunction.skip).toBeInstanceOf(Function);

      expect(await deployFunction.skip!({
        network: {
            config: {
                tags: ["chain1"],
            }
        }
      } as any)).toBe(false)
      expect(await deployFunction.skip!({
        network: {
            config: {
                tags: ["chain3"],
            }
        }
      } as any)).toBe(true)
    });
  });

  describe("skip", () => {
    it("should return a skip function that returns true if none of the contract chains match the network", async () => {
      const contractChains = ["chain1", "chain2"];
      const network = {
        config: {
          tags: ["chain3", "chain4"],
        },
      } as HardhatRuntimeEnvironment["network"];

      const skipFunction = deploymentFactory.skip(contractChains);

      const result = await skipFunction({ network } as any);

      expect(result).toBe(true);
    });

    it("should return a skip function that returns false if at least one of the contract chains match the network", async () => {
      const contractChains = ["chain1", "chain2"];
      const network = {
        config: {
          tags: ["chain1", "chain3"],
        },
      } as HardhatRuntimeEnvironment["network"];

      const skipFunction = deploymentFactory.skip(contractChains);

      const result = await skipFunction({ network } as any);

      expect(result).toBe(false);
    });
  });
});
