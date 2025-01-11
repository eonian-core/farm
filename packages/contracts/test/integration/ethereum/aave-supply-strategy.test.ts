import hre from 'hardhat'
import { expect } from 'chai'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { clearDeployments } from '../../deploy/helpers'
import { deployTaskAction } from '../../../hardhat/tasks'

describe('Aave Supply Strategy', () => {
  // clearDeployments(hre)

  async function setup() {
    // await deployTaskAction([token], hre)

    //   vault = await getContractAt<Vault>('Vault')
    //   vaultAddress = await vault.getAddress()
    //   // hre.tracer.nameTags[vaultAddress] = 'Vault'

    //   holderA = await ethers.getSigner('0x8894e0a0c962cb723c1976a4421c95949be2d4e3') // Binance Hot Wallet #6
    //   await helpers.impersonateAccount(holderA.address)
    //   // hre.tracer.nameTags[holderA.address] = 'Holder A'

    //   holderB = await ethers.getSigner('0xF977814e90dA44bFA03b6295A0616a897441aceC') // Binance Hot Wallet #20
    //   await helpers.impersonateAccount(holderB.address)
    //   // hre.tracer.nameTags[holderB.address] = 'Holder B'

    //   const gelatoAddress = await getAddress(Addresses.GELATO)
    //   await helpers.impersonateAccount(gelatoAddress)
    //   // hre.tracer.nameTags[gelatoAddress] = 'Gelato Ops'

    //   strategy = await getContractAt<ApeLendingStrategy>('ApeLendingStrategy')
    //   strategyAddress = await strategy.getAddress()
    //   // hre.tracer.nameTags[strategyAddress] = 'Strategy'

    //   const assetAddress = await getAddress(Addresses.TOKEN)
    //   assetToken = await hre.ethers.getContractAt('IERC20', assetAddress)
    //   // hre.tracer.nameTags[assetAddress] = 'BUSD'

    //   cTokenAddress = await strategy.cToken()
    //   // hre.tracer.nameTags[cTokenAddress] = 'cToken'

    //   rewardsAddress = await vault.rewards()
    //   // hre.tracer.nameTags[rewardsAddress] = 'Rewards'

  //   await resetBalance(vaultAddress, { tokens: [await vault.asset()] })
  //   await resetBalance(strategyAddress, { tokens: [cTokenAddress] })
  }

  beforeEach(async () => {
    await helpers.loadFixture(setup)
  })
})

async function deploy() {

}
