import { expect } from 'chai';
import sinon from 'sinon';

import { BlockchainType } from '../../hardhat.config';
import { skipFactory, extractContext, resolveDependencies } from '../../hardhat/deploy-or-upgrade';

describe('extractContext', () => {
  it('should return the expected context', async () => {
    const getNamedAccounts = sinon.stub().resolves({});
    const getChainId = sinon.stub().resolves('1337');
    const getNetworkName = sinon.stub().resolves('hardhat');

    const hardhatRuntimeEnvironment = {
      getNamedAccounts,
      getChainId,
      deployments: { getNetworkName, log: sinon.stub() },
    };

    const result = await extractContext(hardhatRuntimeEnvironment as any);

    expect(result).to.deep.equal({
      accounts: {},
      networkName: 'hardhat',
      chainId: '1337',
    });

    expect(getNamedAccounts.calledOnce).to.be.equal(true);
    expect(getChainId.calledOnce).to.be.equal(true);
    expect(getNetworkName.calledOnce).to.be.equal(true);
  });
});

describe('resolveDependencies', () => {
  it('should resolve dependencies correctly', async () => {
    const deployments = {
      get: sinon.stub(),
      log: sinon.stub(),
    };

    const dependencies = ['ContractA', 'ContractB'];

    const ContractA = { address: '0x123' };
    const ContractB = { address: '0x456' };

    deployments.get.withArgs(dependencies[0]).returns(ContractA);
    deployments.get.withArgs(dependencies[1]).returns(ContractB);

    const result = await resolveDependencies(deployments as any, dependencies);

    expect(result).to.deep.equal([ContractA, ContractB]);

    expect(deployments.get.calledTwice).to.be.equal(true);
    expect(deployments.get.getCall(0).args[0]).to.equal(dependencies[0]);
    expect(deployments.get.getCall(1).args[0]).to.equal(dependencies[1]);

    expect(deployments.log.calledOnce).to.be.equal(true);
    expect(deployments.log.getCall(0).args[0]).to.equal('dependencies');
    expect(deployments.log.getCall(0).args[1]).to.deep.equal({
      ContractA: '0x123',
      ContractB: '0x456',
    });
  });
});

describe('skipFactory', () => {
  it('should return true if none of the expected blockchains is present in network tags', async () => {
    const network = {
      config: {
        tags: [BlockchainType.Testnet, BlockchainType.Local],
      },
    };
    const chains = [BlockchainType.Mainnet];

    const shouldSkip = await skipFactory(chains)({ network } as any);

    expect(shouldSkip).to.be.equal(true);
  });

  it('should return false if at least one of the expected blockchains is present in network tags', async () => {
    const network = {
      config: {
        tags: [BlockchainType.Testnet, BlockchainType.Mainnet],
      },
    };
    const chains = [BlockchainType.Mainnet];

    const shouldSkip = await skipFactory(chains)({ network } as any);

    expect(shouldSkip).to.be.equal(false);
  });

  it('should return false if all of the expected blockchains are present in network tags', async () => {
    const network = {
      config: {
        tags: [BlockchainType.Testnet, BlockchainType.Mainnet, BlockchainType.Local],
      },
    };
    const chains = [BlockchainType.Local, BlockchainType.Testnet, BlockchainType.Mainnet];

    const shouldSkip = await skipFactory(chains)({ network } as any);

    expect(shouldSkip).to.be.equal(false);
  });
});
