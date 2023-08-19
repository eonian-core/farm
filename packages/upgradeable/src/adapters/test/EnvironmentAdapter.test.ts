// EnvironmentAdapter.test.ts
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { EnvironmentAdapter } from '../EnvironmentAdapter';
import { Stage } from '../../BaseDeployment.service';

// This mock is used to control the return value of network.config.tags
const mockHre: HardhatRuntimeEnvironment = {
  network: {
    config: {
      tags: [],
    },
  } as any, // this is only part of HardhatRuntimeEnvironment, so type it as any
  // other members of HardhatRuntimeEnvironment would be here
} as any;

describe('EnvironmentAdapter', () => {
  beforeEach(() => {
    // clear the tags before each test
    mockHre.network.config.tags = [];
  });

  test('should return Development when tags are undefined', async () => {
    const adapter = new EnvironmentAdapter(mockHre);
    expect(await adapter.getStage()).toBe(Stage.Development);
  });

  test('should return Development when tags are empty', async () => {
    mockHre.network.config.tags = [];
    const adapter = new EnvironmentAdapter(mockHre);
    expect(await adapter.getStage()).toBe(Stage.Development);
  });

  test('should return the first tag as the Stage', async () => {
    const expectedStage: Stage = Stage.Production;

    mockHre.network.config.tags = [expectedStage, 'other'];

    const adapter = new EnvironmentAdapter(mockHre);

    expect(await adapter.getStage()).toBe(expectedStage);
  });

  test('should return the second tag as the Stage.Staging', async () => {
    const expectedStage: Stage = Stage.Staging;

    mockHre.network.config.tags = ['other', expectedStage];

    const adapter = new EnvironmentAdapter(mockHre);

    expect(await adapter.getStage()).toBe(expectedStage);
  });

  test('should return the second tag as the Stage.Development', async () => {
    const expectedStage: Stage = Stage.Development;

    mockHre.network.config.tags = ['other', expectedStage];

    const adapter = new EnvironmentAdapter(mockHre);

    expect(await adapter.getStage()).toBe(expectedStage);
  });

  test('should return the Stage.Development when not have stages', async () => {
    const expectedStage: Stage = Stage.Development;

    mockHre.network.config.tags = ['other', 'expectedStage'];

    const adapter = new EnvironmentAdapter(mockHre);

    expect(await adapter.getStage()).toBe(expectedStage);
  });
});
