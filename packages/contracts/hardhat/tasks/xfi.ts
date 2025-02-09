import { task } from 'hardhat/config'

/**
 * Works: yarn hardhat xfi --network hardhat
 * Doesn't: yarn hardhat xfi --network crossfi_testnet_dev
 *
 * Error: ProviderError: rpc error: code = invalidargument desc = execution reverted: address: low-level delegate call failed: invalid request
 * Caused on call: proxyInstance.test_upgradeToAndCall
 */
task('xfi', async (args, hre) => {
  const { ethers } = hre

  const signer = await ethers.getSigners()

  const abiCoder = new ethers.Interface([
    `function initialize(
        address _asset,
        address _rewards,
        uint256 _managementFee,
        uint256 _lockedProfitReleaseRate,
        string memory _name,
        string memory _symbol,
        address[] memory _defaultOperators,
        uint256 _foundersFee
    )`,
  ])
  const initData = abiCoder.encodeFunctionData('initialize', [
    '0x83E9A41c38D71f7a06632dE275877FcA48827870', // Token address
    await signer[0].getAddress(), // Address for rewards
    1500, // 30% fee for production versions, 15% for dev.
    10n ** 18n / 3600n, // 6 hours for locked profit release
    'EonianVault Shares', // Vault name
    'eon', // Vault share symbol
    [], // Parameter: "defaultOperators"
    100, // Vault founder tokens fee (1%)
  ])

  const VaultFactory = await ethers.getContractFactory('Vault', signer[0])
  const vault = await VaultFactory.deploy(false)
  await vault.waitForDeployment()

  const implementationAddress = await vault.getAddress()
  console.log('Vault deployed at:', implementationAddress)

  const ProxyFactory = await ethers.getContractFactory('ERC1967ProxyCustom', signer[0])
  const proxy = await ProxyFactory.deploy(implementationAddress, initData)
  await proxy.waitForDeployment()

  const proxyAddress = await proxy.getAddress()
  console.log('Proxy deployed at:', proxyAddress)

  const proxyInstance = await ethers.getContractAt('ERC1967ProxyCustom', proxyAddress)
  const tx = await proxyInstance.test_upgradeToAndCall(implementationAddress, initData)
  await tx.wait()
  return proxy
})
