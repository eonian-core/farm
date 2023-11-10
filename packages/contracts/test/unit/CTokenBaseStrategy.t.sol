// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";
import "./mocks/OpsMock.sol";
import "./mocks/BaseStrategyMock.sol";
import "./mocks/AggregatorV3Mock.sol";
import "./mocks/CTokenMock.sol";
import "./mocks/RainMakerMock.sol";
import "./mocks/PancakeRouterMock.sol";
import "./mocks/CTokenBaseStrategyMock.sol";

import "contracts/strategies/CTokenBaseStrategy.sol";

import "./helpers/TestWithERC1820Registry.sol";
import "./mocks/VaultFounderTokenMock.sol";

contract CTokenBaseStrategyTest is TestWithERC1820Registry {
    address private constant BANANA = 0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95;
    address private constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address private constant RAIN_MAKER = 0x5CB93C0AdE6B7F2760Ec4389833B0cCcb5e4efDa;
    address private constant PANCAKE_ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    uint256 private constant SECONDS_PER_BLOCK = 3;
    uint256 private constant REWARD_ESTIMATION_ACCURACY = 90;

    ERC20Mock underlying;
    VaultMock vault;
    VaultFounderTokenMock vaultFounderToken;
    OpsMock ops;
    CTokenMock cToken;

    address rewards = vm.addr(1);
    address alice = vm.addr(2);
    address culprit = vm.addr(333);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;
    uint256 defaultFounderFee = 100;

    uint256 minReportInterval = 3600;
    bool isPrepaid = false;

    AggregatorV3Mock nativeTokenPriceFeed;
    AggregatorV3Mock assetPriceFeed;

    RainMakerMock rainMaker;
    PancakeRouterMock pancakeRouter;

    CTokenBaseStrategyMock strategy;

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(alice, "alice");
        vm.label(culprit, "culprit");

        underlying = new ERC20Mock("Mock Token", "TKN");
        vm.label(address(underlying), "underlying");

        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );
        vm.label(address(vault), "vault");

        vaultFounderToken = new VaultFounderTokenMock(3, 12_000, 200, vault);
        vault.setFounders(address(vaultFounderToken));

        ops = new OpsMock();
        ops.setGelato(payable(alice));
        vm.label(address(ops), "ops");

        cToken = new CTokenMock(underlying);
        vm.label(address(cToken), "cToken");

        nativeTokenPriceFeed = new AggregatorV3Mock();
        nativeTokenPriceFeed.setDecimals(8);
        nativeTokenPriceFeed.setPrice(274 * 1e8);

        assetPriceFeed = new AggregatorV3Mock();
        assetPriceFeed.setDecimals(8);
        assetPriceFeed.setPrice(1e8);

        ERC20Mock banana = new ERC20Mock("BANANA", "BANANA");
        vm.etch(BANANA, address(banana).code);

        vm.etch(RAIN_MAKER, address(new RainMakerMock()).code);
        rainMaker = RainMakerMock(RAIN_MAKER);
        rainMaker.setCompSupplySpeeds(31250000000000000);

        vm.etch(PANCAKE_ROUTER, address(new PancakeRouterMock()).code);
        pancakeRouter = PancakeRouterMock(PANCAKE_ROUTER);

        strategy = new CTokenBaseStrategyMock(
            vault,
            IERC20Upgradeable(address(underlying)),
            cToken,
            IRainMaker(RAIN_MAKER),
            IERC20Upgradeable(BANANA),
            ops,
            nativeTokenPriceFeed,
            assetPriceFeed,
            minReportInterval,
            isPrepaid
        );
        vault.addStrategy(address(strategy), 10_000);
    }

    function testShouldRevertIfCTokenDecimalsAreWrong() public {
        cToken.setDecimals(18);

        vm.expectRevert(UnsupportedDecimals.selector);
        strategy = new CTokenBaseStrategyMock(
            vault,
            IERC20Upgradeable(address(underlying)),
            cToken,
            IRainMaker(RAIN_MAKER),
            IERC20Upgradeable(BANANA),
            ops,
            nativeTokenPriceFeed,
            assetPriceFeed,
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldRevertIfAssetDecimalsAreWrong() public {
        underlying.setDecimals(12);

        vm.expectRevert(UnsupportedDecimals.selector);
        strategy = new CTokenBaseStrategyMock(
            vault,
            IERC20Upgradeable(address(underlying)),
            cToken,
            IRainMaker(RAIN_MAKER),
            IERC20Upgradeable(BANANA),
            ops,
            nativeTokenPriceFeed,
            assetPriceFeed,
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldRevertIfAssetAndCTokenUnderlyingAreNotSame() public {
        underlying = new ERC20Mock("Mock Token 2", "TKN2");

        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );
        vaultFounderToken = new VaultFounderTokenMock(3, 12_000, 200, vault);
        vault.setFounders(address(vaultFounderToken));

        vm.expectRevert(IncompatibleCTokenContract.selector);
        strategy = new CTokenBaseStrategyMock(
            vault,
            IERC20Upgradeable(address(underlying)),
            cToken,
            IRainMaker(RAIN_MAKER),
            IERC20Upgradeable(BANANA),
            ops,
            nativeTokenPriceFeed,
            assetPriceFeed,
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldGiveFullAllowanceToDeps() public {
        uint256 cTokenAllowance = underlying.allowance(
            address(strategy),
            address(cToken)
        );
        assertEq(cTokenAllowance, type(uint256).max);
    }

    function testShouldDisplayCorrectName() public {
        assertEq(strategy.name(), "BaseStrategyMock");
    }

    function testShouldReturnCorrectCurrentBananaBalance(uint256 bananaBalance)
        public
        returns (uint256)
    {
        ERC20Mock(BANANA).mint(address(strategy), bananaBalance);
        assertEq(strategy.currentBananaBalance(), bananaBalance);

        return bananaBalance;
    }

    function testShouldReturnZeroTotalBananaAssetBalanceIfNoBanana() public {
        assertEq(strategy.currentBananaBalance(), 0);
    }

    function testShouldCalculateDepositedBalanceFromSnapshot(
        uint128 cTokenBalance,
        uint32 exchangeRate
    ) public {
        // Give the required funds to Actor
        underlying.mint(address(strategy), cTokenBalance);
        assertEq(underlying.balanceOf(address(strategy)), cTokenBalance);

        vm.prank(address(strategy));
        cToken.mint(cTokenBalance);
        cToken.setExchangeRate(exchangeRate);

        (uint256 shares, uint256 balance) = strategy.depositedBalanceSnapshot();
        assertEq(shares, cTokenBalance);
        assertEq(balance, (uint256(cTokenBalance) * exchangeRate) / 1e18);
    }


    function testShouldClaimBanana() public {
        vm.expectEmit(true, true, true, true);
        rainMaker.emitClaimCompCalled(address(strategy), address(cToken));

        strategy.claimBanana();
    }

    // test interestRatePerBlock
    function testShouldReturnCorrectInterestRatePerBlock(
        bool _blocksBased,
        uint128 _interestRatePerBlock
    ) public {
        uint256 interestRatePerBlock = _interestRatePerBlock;
        cToken.setBlocksBased(_blocksBased);
        cToken.setSupplyRatePerBlock(interestRatePerBlock);

        if (_blocksBased) {
            assertEq(strategy.interestRatePerBlock(), interestRatePerBlock);
        } else {
            assertEq(strategy.interestRatePerBlock(), interestRatePerBlock * strategy.secondPerBlock());
        }
    }

    // test borrowRatePerBlock
    function testShouldReturnCorrectBorrowRatePerBlock(
        bool _blocksBased,
        uint128 _borrowRatePerBlock
    ) public {
        uint256 borrowRatePerBlock = _borrowRatePerBlock;
        cToken.setBlocksBased(_blocksBased);
        cToken.setBorrowRatePerBlock(borrowRatePerBlock);

        if (_blocksBased) {
            assertEq(strategy.borrowRatePerBlock(), borrowRatePerBlock);
        } else {
            assertEq(strategy.borrowRatePerBlock(), borrowRatePerBlock * strategy.secondPerBlock());
        }
    }

    // test supplyRatePerBlock
    function testShouldReturnCorrectSupplyRatePerBlock(
        bool _blocksBased,
        uint128 _supplyRatePerBlock
    ) public {
        uint256 supplyRatePerBlock = _supplyRatePerBlock;
        cToken.setBlocksBased(_blocksBased);
        cToken.setSupplyRatePerBlock(supplyRatePerBlock);

        if (_blocksBased) {
            assertEq(strategy.supplyRatePerBlock(), supplyRatePerBlock);
        } else {
            assertEq(strategy.supplyRatePerBlock(), supplyRatePerBlock * strategy.secondPerBlock());
        }
    }

    // test exchangeRateCurrent
    function testShouldReturnCorrectExchangeRateCurrent(
        uint256 exchangeRateCurrent
    ) public {
        cToken.setExchangeRateCurrent(exchangeRateCurrent);

        assertEq(strategy.exchangeRateCurrent(), exchangeRateCurrent);
    }

    // test exchangeRateStored
    function testShouldReturnCorrectExchangeRateStored(
        uint256 exchangeRateStored
    ) public {
        cToken.setExchangeRate(exchangeRateStored);

        assertEq(strategy.exchangeRateStored(), exchangeRateStored);
    }

    function testShouldaccrueInterest(uint256 _accrueInterest) public {
        cToken.setAccrueInterest(_accrueInterest);

        assertEq(strategy.accrueInterest(), _accrueInterest);
    }

    function _setupHarvestData(
        uint128 assetBalance,
        uint128 cTokenBalance,
        uint128 currentDebt
    ) internal {
        vm.prank(address(strategy));
        cToken.mint(cTokenBalance);
        assertEq(cToken.balanceOf(address(strategy)), cTokenBalance);

        underlying.mint(address(strategy), assetBalance);
        assertEq(underlying.balanceOf(address(strategy)), assetBalance);

        vm.mockCall(
            address(vault),
            abi.encodeWithSelector(IVault(vault).currentDebt.selector),
            abi.encode(currentDebt)
        );
    }
}
