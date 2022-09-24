// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";
import "./mocks/OpsMock.sol";
import "./mocks/BaseStrategyMock.sol";
import "./mocks/AggregatorV3Mock.sol";
import "./mocks/CTokenMock.sol";
import "./mocks/RainMakerMock.sol";

import "./mocks/ApeLendingStrategyMock.sol";

contract ApeLendingStrategyTest is Test {
    address public constant BANANA = 0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95;
    address public constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address public constant RAIN_MAKER =
        0x5CB93C0AdE6B7F2760Ec4389833B0cCcb5e4efDa;
    address public constant PANCAKE_ROUTER =
        0x10ED43C718714eb63d5aA57B78B54704E256024E;

    ERC20Mock underlying;
    VaultMock vault;
    OpsMock ops;
    CTokenMock cToken;

    address rewards = vm.addr(1);
    address alice = vm.addr(2);
    address culprit = vm.addr(333);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;

    uint256 minReportInterval = 3600;
    bool isPrepaid = false;

    AggregatorV3Mock nativeTokenPriceFeed;
    AggregatorV3Mock assetPriceFeed;

    RainMakerMock rainMaker;

    ApeLendingStrategyMock strategy;

    function setUp() public {
        underlying = new ERC20Mock("Mock Token", "TKN");

        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate
        );

        ops = new OpsMock();
        ops.setGelato(payable(alice));

        cToken = new CTokenMock(address(underlying));

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

        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
        vault.addStrategy(address(strategy), 10_000);
    }

    function testShouldRevertIfCTokenDecimalsAreWrong() public {
        cToken.setDecimals(18);

        vm.expectRevert(UnsupportedDecimals.selector);
        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldRevertIfAssetDecimalsAreWrong() public {
        underlying.setDecimals(12);

        vm.expectRevert(UnsupportedDecimals.selector);
        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldRevertIfAssetAndCTokenUnderlyingAreNotSame() public {
        underlying.setDecimals(12);

        vm.expectRevert(IncompatibleCTokenContract.selector);
        strategy = new ApeLendingStrategyMock(
            address(vault),
            address(cToken),
            address(ops),
            address(nativeTokenPriceFeed),
            address(assetPriceFeed),
            minReportInterval,
            isPrepaid
        );
    }

    function testShouldGiveFullAllowanceToDeps() public {
        uint256 routerAllowance = ERC20Mock(BANANA).allowance(
            address(strategy),
            PANCAKE_ROUTER
        );
        assertEq(routerAllowance, type(uint256).max);

        uint256 cTokenAllowance = underlying.allowance(
            address(strategy),
            address(cToken)
        );
        assertEq(cTokenAllowance, type(uint256).max);
    }

    function testShouldDisplayCorrectName() public {
        assertEq(strategy.name(), "TKN ApeLending Strategy");
    }

    function testShouldCalculateDepositedBalanceFromSnapshot(
        uint128 cTokenBalance,
        uint32 exchangeRate
    ) public {
        cToken.setBalanceSnapshot(cTokenBalance);
        cToken.setExchangeRate(exchangeRate);

        uint256 balance = strategy.depositedBalanceSnapshot();
        assertEq(balance, (uint256(cTokenBalance) * exchangeRate) / 1e18);
    }

    function testShouldReturnDepositedBalance(uint192 balance) public {
        vm.prank(address(strategy));
        cToken.mint(balance);

        assertEq(balance, strategy.depositedBalance());
    }

    function testShouldReturnZeroEstimatedAccruedBananaPerBlockIfBalanceIsZero(
        uint32 exchangeRate
    ) public {
        cToken.setExchangeRate(exchangeRate);
        cToken.setBalanceSnapshot(0);

        assertEq(strategy.estimatedAccruedBanana(), 0);
    }

    function testShouldReturnZeroEstimatedAccruedBananaPerBlockIfRateIsZero(
        uint32 balance
    ) public {
        cToken.setExchangeRate(0);
        cToken.setBalanceSnapshot(balance);

        assertEq(strategy.estimatedAccruedBanana(), 0);
    }

    function testShouldReturnZeroEstimatedAccruedBananaPerBlockIfTotalSupplyIsZero(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint64 supplySpeed
    ) public {
        vm.assume(exchangeRate > 0);
        vm.assume(cTokenBalance > 0);
        vm.assume(supplySpeed > 0 && supplySpeed < 4e16);

        cToken.setExchangeRate(exchangeRate);
        cToken.setBalanceSnapshot(cTokenBalance);

        uint256 totalSupply = 0;

        vm.prank(address(this));
        cToken.mint(totalSupply);

        rainMaker.setCompSupplySpeeds(supplySpeed);

        assertEq(strategy.estimatedAccruedBananaPerBlock(), 0);
    }

    function testShouldCalculateEstimatedAccruedBananaPerBlock(
        uint128 cTokenBalance,
        uint32 exchangeRate,
        uint192 totalSupply,
        uint64 supplySpeed
    ) public {
        vm.assume(exchangeRate > 0);
        vm.assume(cTokenBalance > 0);
        vm.assume(totalSupply > 1e18);
        vm.assume(supplySpeed > 0 && supplySpeed < 4e16);

        cToken.setExchangeRate(exchangeRate);
        cToken.setBalanceSnapshot(cTokenBalance);

        vm.prank(address(this));
        cToken.mint(totalSupply);

        rainMaker.setCompSupplySpeeds(supplySpeed);

        uint256 deposited = (uint256(cTokenBalance) * exchangeRate) / 1e18;
        uint256 underlyingTotalSupply = (uint256(totalSupply) * exchangeRate) /
            1e18;
        uint256 expected = (deposited * supplySpeed) / underlyingTotalSupply;
        assertEq(strategy.estimatedAccruedBananaPerBlock(), expected);
    }
}
