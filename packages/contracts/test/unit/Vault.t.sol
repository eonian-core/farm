// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";
import {IVaultHookMock} from"./mocks/IVaultHookMock.sol";

import "contracts/lending/Lender.sol";
import "contracts/lending/StrategiesLender.sol";
import {GivenAssetsResultIsZeroShares} from "contracts/tokens/ERC4626Upgradeable.sol";

import "./helpers/TestWithERC1820Registry.sol";
import "./mocks/VaultFounderTokenMock.sol";

contract VaultTest is TestWithERC1820Registry {
    uint256 constant MAX_BPS = 10_000;
    uint256 constant MAX_DEPOSIT = 10**38;
    uint256 constant LOCKED_PROFIT_RELEASE_SCALE = 10**18;

    ERC20Mock underlying;
    VaultMock vault;
    VaultFounderTokenMock vaultFounderToken;

    StrategyMock strategy;

    address rewards = vm.addr(1);
    address culprit = vm.addr(2);

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;
    uint256 defaultFounderFee = 100;

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        underlying = new ERC20Mock("Mock Token", "TKN");
        
        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderFee
        );

        vaultFounderToken = new VaultFounderTokenMock(3, 12_000, 200, vault);
        vault.setFounders(address(vaultFounderToken));

        strategy = new StrategyMock(address(underlying), address(vault));
    }

    function testVaultMetadata() public {
        assertEq(vault.symbol(), "eonTKN");
        assertEq(vault.name(), "TKN Eonian Vault Shares");
    }

    function testRevertWhenInitFunctionsCalled() public {
        vm.expectRevert(
            bytes("Initializable: contract is already initialized")
        );
        vault.initialize(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            "",
            "",
            new address[](0),
            defaultFounderFee
        );
    }

    function testAddingStrategy(uint16 debtRatio) public {
        vm.assume(debtRatio <= MAX_BPS);

        address strategyAddress = address(strategy);

        vm.expectEmit(true, true, true, true);
        vault.emitStrategyAddedEvent(strategyAddress, debtRatio);

        vault.addStrategy(strategyAddress, debtRatio);
        assertEq(vault.withdrawalQueue(0), strategyAddress);
        assertEq(vault.hasStrategyAsBorrower(strategyAddress), true);
    }

    function testRevertWhenAddingInvalidStrategy() public {
        // Checking if zero address passed
        vm.expectRevert(UnexpectedZeroAddress.selector);
        vault.addStrategy(address(0), MAX_BPS);

        // Checking if wrong underlying token specified
        ERC20Mock wrongAsset = new ERC20Mock("Wrong Mock Token", "Wrong TKN");
        StrategyMock strategyWrongAsset = new StrategyMock(
            address(wrongAsset),
            address(vault)
        );
        vm.expectRevert(InappropriateStrategy.selector);
        vault.addStrategy(address(strategyWrongAsset), MAX_BPS);

        // Checking if vaults don't not match
        VaultMock wrongVault = new VaultMock(
            address(underlying),
            rewards,
            0,
            defaultLPRRate,
            defaultFounderFee
        );
        StrategyMock strategyWrongVault = new StrategyMock(
            address(underlying),
            address(wrongVault)
        );
        vm.expectRevert(InappropriateStrategy.selector);
        vault.addStrategy(address(strategyWrongVault), MAX_BPS);
    }

    function testRevertWhenAddingStrategyAndVaultIsPaused() public {
        vault.setEmergencyShutdown(true);

        vm.expectRevert(bytes("Pausable: paused"));
        vault.addStrategy(address(strategy), MAX_BPS);
    }

    function testRevertWhenAddingStrategyFromNonOwnerAccount() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        vault.addStrategy(address(strategy), MAX_BPS);
    }

    function testRevokingStrategy(uint16 debtRatio) public {
        vm.assume(debtRatio <= MAX_BPS);

        address strategyAddress = address(strategy);

        vault.addStrategy(strategyAddress, debtRatio);
        assertEq(vault.debtRatio(), debtRatio);
        assertEq(vault.currentDebtRatio(strategyAddress), debtRatio);

        vm.expectEmit(true, true, true, true);
        vault.emitStrategyRevokedEvent(strategyAddress);

        vault.revokeStrategy(strategyAddress);
        assertEq(vault.debtRatio(), 0);
        assertEq(vault.currentDebtRatio(strategyAddress), 0);
    }

    function testRevertWhenRevokingStrategyFromNonOwnerAccount() public {
        address strategyAddress = address(strategy);
        vault.addStrategy(strategyAddress, MAX_BPS);

        vm.expectRevert(
            abi.encodeWithSelector(AccessDeniedForCaller.selector, culprit)
        );

        vm.prank(culprit);
        vault.revokeStrategy(strategyAddress);
    }

    function testRemovingStrategy(bool fromQueueOnly) public {
        address strategyAddress = address(strategy);

        // We can only delete a strategy with 0 debt ratio
        vault.addStrategy(strategyAddress, 0);

        vm.expectEmit(true, true, true, true);
        vault.emitStrategyRemovedEvent(strategyAddress, fromQueueOnly);

        vault.removeStrategy(strategyAddress, fromQueueOnly);

        assertEq(vault.getQueueSize(), 0);
        assertEq(vault.hasStrategyAsBorrower(strategyAddress), fromQueueOnly);
    }

    function testRevertWhenRemovingStrategyWithDebt(uint16 debtRatio) public {
        vm.assume(debtRatio > 0 && debtRatio <= MAX_BPS);
        address strategyAddress = address(strategy);

        // We can only delete a strategy with 0 debt ratio
        vault.addStrategy(strategyAddress, debtRatio);

        vm.expectRevert(BorrowerHasDebt.selector);
        vault.removeStrategy(strategyAddress, false);
    }

    function testRevertWhenRemovingMissingStrategy(bool fromQueueOnly) public {
        address strategyAddress = address(strategy);

        vm.expectRevert(StrategyNotFound.selector);

        vault.removeStrategy(strategyAddress, fromQueueOnly);
    }

    function testRevertWhenRemovingStrategyFromNonOwnerAccount(
        bool fromQueueOnly
    ) public {
        address strategyAddress = address(strategy);
        vault.addStrategy(strategyAddress, 0);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        vault.removeStrategy(strategyAddress, fromQueueOnly);
    }

    function testAddingStrategyToQueue() public {
        address strategyAddress = address(strategy);
        vault.addStrategy(strategyAddress, 0);

        // Removing strategy from queue only
        vault.removeStrategy(strategyAddress, true);

        assertEq(vault.getQueueSize(), 0);
        assertEq(vault.hasStrategyAsBorrower(strategyAddress), true);

        vm.expectEmit(true, true, true, true);
        vault.emitStrategyReturnedToQueueEvent(strategyAddress);
        vault.addStrategyToQueue(strategyAddress);

        assertEq(vault.getQueueSize(), 1);
        assertEq(vault.hasStrategyAsBorrower(strategyAddress), true);
    }

    function testRevertAddingStrategyToQueueWithZeroAddress() public {
        vm.expectRevert(UnexpectedZeroAddress.selector);
        vault.addStrategyToQueue(address(0));
    }

    function testRevertAddingStrategyToQueueIfAlreadyExists() public {
        address strategyAddress = address(strategy);
        vault.addStrategy(strategyAddress, 0);

        assertEq(vault.getQueueSize(), 1);
        assertEq(vault.hasStrategyAsBorrower(strategyAddress), true);

        vm.expectRevert(StrategyAlreadyExists.selector);

        vault.addStrategyToQueue(strategyAddress);
    }

    function testRevertAddingStrategyToQueueIfNotRegistered() public {
        vm.expectRevert(BorrowerDoesNotExist.selector);

        address strategyAddress = address(strategy);
        vault.addStrategyToQueue(strategyAddress);
    }

    function testRevertWhenAddingStrategyToQueueFromNonOwnerAccount() public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        address strategyAddress = address(strategy);
        vault.addStrategyToQueue(strategyAddress);
    }

    /// @dev See detailed reordering test implementations in AddressList.t.sol
    function testReorderingWithdrawalQueue() public {
        vault.addStrategy(address(strategy), 0);

        StrategyMock strategyB = new StrategyMock(
            address(underlying),
            address(vault)
        );
        vault.addStrategy(address(strategyB), 0);

        assertEq(vault.getQueueSize(), 2);
        assertEq(vault.withdrawalQueue(0), address(strategy));
        assertEq(vault.withdrawalQueue(1), address(strategyB));

        address[] memory newOrder = new address[](2);
        newOrder[0] = address(strategyB);
        newOrder[1] = address(strategy);
        vault.reorderWithdrawalQueue(newOrder);

        assertEq(vault.getQueueSize(), 2);
        assertEq(vault.withdrawalQueue(0), address(strategyB));
        assertEq(vault.withdrawalQueue(1), address(strategy));
    }

    function testReorderingWithdrawalQueueFromNonOwnerAccount() public {
        vault.addStrategy(address(strategy), 0);

        StrategyMock strategyB = new StrategyMock(
            address(underlying),
            address(vault)
        );
        vault.addStrategy(address(strategyB), 0);

        assertEq(vault.getQueueSize(), 2);
        assertEq(vault.withdrawalQueue(0), address(strategy));
        assertEq(vault.withdrawalQueue(1), address(strategyB));

        address[] memory newOrder = new address[](2);
        newOrder[0] = address(strategyB);
        newOrder[1] = address(strategy);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        vault.reorderWithdrawalQueue(newOrder);
    }

    function testSetRewardsAddress() public {
        assertEq(vault.rewards(), rewards);

        address newRewardsAddress = vm.addr(3);
        assertEq(newRewardsAddress == rewards, false);

        vault.setRewards(newRewardsAddress);
        assertEq(vault.rewards(), newRewardsAddress);
    }

    function testRevertWhenSetRewardsAddressFromNonOwnerAccount() public {
        address newRewardsAddress = vm.addr(3);
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        vault.setRewards(newRewardsAddress);
    }

    function testSetManagementFee(uint256 newFee) public {
        vm.assume(newFee <= MAX_BPS - defaultFounderFee);

        assertEq(vault.managementFee(), defaultFee);

        vault.setManagementFee(newFee);
        assertEq(vault.managementFee(), newFee);
    }

    function testRevertWhenSetManagementFeeFromNonOwnerAccount(uint256 newFee)
        public
    {
        vm.assume(newFee <= MAX_BPS);
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        vault.setManagementFee(newFee);
    }

    function testRevertWhenSetManagementFeeOverMaxAmount() public {
        vm.expectRevert(ExceededMaximumFeeValue.selector);
        vault.setManagementFee(MAX_BPS + 1);
    }

    function testSetEmergencyShutdown() public {
        assertEq(vault.paused(), false);

        vm.expectEmit(true, true, true, true);
        vault.emitPausedEvent();
        vault.setEmergencyShutdown(true);
        assertEq(vault.paused(), true);

        vm.expectEmit(true, true, true, true);
        vault.emitUnpausedEvent();
        vault.setEmergencyShutdown(false);
        assertEq(vault.paused(), false);
    }

    function testSetEmergencyShutdownFromNonOwnerAccount() public {
        assertEq(vault.paused(), false);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        vault.setEmergencyShutdown(true);
    }

    function testChargingAndFounderFeesFail() public {
        vm.expectRevert(ExceededMaximumFeeValue.selector);

        uint256 fee = MAX_BPS;
        uint256 founderFee = 1;

        vault = new VaultMock(
            address(underlying),
            rewards,
            fee,
            defaultLPRRate,
            founderFee
        );
    }

    // test only chargingFees
    function testChargingFees() public {
        uint256 fee = MAX_BPS;
        uint256 deposit = 10_000_000;

        vault = new VaultMock(
            address(underlying),
            rewards,
            fee,
            defaultLPRRate,
            0
        );
        strategy = new StrategyMock(address(underlying), address(vault));

        // Mint some initial funds for the vault
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Alice deposits funds to the vault
        vm.prank(alice);
        vault.deposit(deposit);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(vault), 10_000);

        vm.expectEmit(true, true, true, true);
        vault.emitMintTransferEvent(address(rewards), 9990);


        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(10_000, 0);

        // The full amount must be transferred to the vaultFounderToken address, as the fee factor is 50%
        assertEq(vault.balanceOf(rewards), 9990);
    }

    // test only founderFees
    function testChargingFoundersFees() public {
        uint256 founderFee = MAX_BPS;
        uint256 deposit = 10_000_000;

        vault = new VaultMock(
            address(underlying),
            rewards,
            0,
            defaultLPRRate,
            founderFee
        );
        vault.setFounders(address(vaultFounderToken));
        vaultFounderToken.setVault(vault);
        strategy = new StrategyMock(address(underlying), address(vault));

        // Mint some initial funds for the vault
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Alice deposits funds to the vault
        vm.prank(alice);
        vault.deposit(deposit);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(vault), 10_000);

        vm.expectEmit(true, true, true, true);
        vault.emitMintTransferEvent(address(vaultFounderToken), 9990);

        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(10_000, 0);

        // The full amount must be transferred to the rewards address, as the fee factor is 50%
        assertEq(vault.balanceOf(address(vaultFounderToken)), 9990);
    }

    function testChargingManagmentAndFoundersFees() public {
        uint256 chargingFee = 100;
        uint256 founderFee = 100;
        uint256 deposit = 10_000_000;

        vault = new VaultMock(
            address(underlying),
            rewards,
            chargingFee,
            defaultLPRRate,
            founderFee
        );
        vault.setFounders(address(vaultFounderToken));
        vaultFounderToken.setVault(vault);
        strategy = new StrategyMock(address(underlying), address(vault));

        // Mint some initial funds for the vault
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Alice deposits funds to the vault
        vm.prank(alice);
        vault.deposit(deposit);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(vault), 10_000);

        vm.expectEmit(true, true, true, true);
        vault.emitMintTransferEvent(address(rewards), 99);
        vm.expectEmit(true, true, true, true);
        vault.emitMintTransferEvent(address(vaultFounderToken), 99);


        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(10_000, 0);

        // The half amount must be transferred to the rewards address, as the fee factor is 50%
        assertEq(vault.balanceOf(address(vaultFounderToken)), 99);
        // The half amount must be transferred to the vaultFounderToken address, as the fee factor is 50%
        assertEq(vault.balanceOf(rewards), 99);
    }

    function testChargingManagementFeesWithoutVaultFounderToken() public {
        uint256 chargingFee = 100;
        uint256 founderFee = 100;
        uint256 deposit = 10_000_000;

        vault = new VaultMock(
            address(underlying),
            rewards,
            chargingFee,
            defaultLPRRate,
            founderFee
        );
        strategy = new StrategyMock(address(underlying), address(vault));

        // Mint some initial funds for the vault
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Alice deposits funds to the vault
        vm.prank(alice);
        vault.deposit(deposit);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(vault), 10_000);

        vm.expectEmit(true, true, true, true);
        vault.emitMintTransferEvent(address(rewards), 99);

        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(10_000, 0);

        // The half amount must be transferred to the vaultFounderToken address, as the fee factor is 50%
        assertEq(vault.balanceOf(rewards), 99);
    }

    function testChargingFeesFuzz(
        uint192 initialVaultBalance,
        uint16 fee,
        uint16 strategyRatio,
        uint256 strategyGain,
        uint256 founderFee
    ) public {
        vm.assume(fee <= MAX_BPS);
        vm.assume(founderFee <= MAX_BPS);
        vm.assume(fee + founderFee <= MAX_BPS);
        vm.assume(strategyRatio <= MAX_BPS);
        vm.assume(
            strategyGain <
                (uint256(initialVaultBalance) * strategyRatio) / MAX_BPS
        );

        vault = new VaultMock(
            address(underlying),
            rewards,
            fee,
            defaultLPRRate,
            founderFee
        );
        strategy = new StrategyMock(address(underlying), address(vault));

        // Mint some initial funds for the vault
        underlying.mint(address(vault), initialVaultBalance);
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        assertEq(vault.freeAssets(), initialVaultBalance);

        // Initialize the strategy
        vault.addStrategy(address(strategy), strategyRatio);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        uint256 expectedFee = (strategyGain * fee) / MAX_BPS;
        uint256 expectedShares = expectedFee > 0
            ? vault.convertToShares(expectedFee)
            : 0;
        if (expectedShares > 0) {
            vm.expectEmit(true, true, true, true);
            vault.emitMintTransferEvent(rewards, expectedShares);
        }

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(strategy), strategyGain);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(strategyGain, 0);

        assertEq(vault.balanceOf(rewards), expectedShares);
    }

    function testTotalAssetsAmountStaysTheConsistent(
        uint192 initialVaultBalance
    ) public {
        // Mint some initial funds for the vault
        underlying.mint(address(vault), initialVaultBalance);
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        assertEq(vault.totalAssets(), initialVaultBalance);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS / 2);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        assertEq(vault.totalAssets(), initialVaultBalance);

        // Initialize the second strategy
        StrategyMock strategyB = new StrategyMock(
            address(underlying),
            address(vault)
        );
        vault.addStrategy(address(strategyB), MAX_BPS / 4);
        vm.prank(address(strategyB));
        vault.reportNegativeDebtManagement(0, 0);

        assertEq(vault.totalAssets(), initialVaultBalance);
    }

    function testTotalAssetsAmountAfterPositiveReport(
        uint192 initialVaultBalance,
        uint256 gain
    ) public {
        vm.assume(gain < initialVaultBalance / 10);
        vm.assume(initialVaultBalance < 10**16);

        // Mint some initial funds for the vault
        underlying.mint(address(vault), initialVaultBalance);
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        assertEq(vault.totalAssets(), initialVaultBalance);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        assertEq(vault.totalAssets(), initialVaultBalance);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(strategy), gain);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(gain, 0);

        assertEq(
            vault.totalAssets(),
            initialVaultBalance + gain - vault.calculateLockedProfit()
        );
    }

    function testTotalAssetsAmountAfterNegativeReport(
        uint192 initialVaultBalance,
        uint256 loss
    ) public {
        vm.assume(loss < initialVaultBalance / 10);

        // Mint some initial funds for the vault
        underlying.mint(address(vault), initialVaultBalance);
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        assertEq(vault.totalAssets(), initialVaultBalance);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        assertEq(vault.totalAssets(), initialVaultBalance);

        // Assume some time passed and strategy realized a loss
        vm.warp(block.timestamp + 1000);
        underlying.burn(address(strategy), loss);
        vm.prank(address(strategy));
        vault.reportNegativeDebtManagement(loss, 0);

        assertEq(vault.totalAssets(), initialVaultBalance - loss);
    }

    /// @dev Testing redistribution of the amount of underlying assets between the vault and the strategies
    ///      This particaular case is for Vault -> Strategy transfer
    function testVaultToStrategyLendingFunctionality(
        uint192 initialVaultBalance,
        uint16 ratio
    ) public {
        vm.assume(ratio <= MAX_BPS);
        // Mint some initial funds for the vault
        underlying.mint(address(vault), initialVaultBalance);
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Vault should have the initial amount of tokens
        assertEq(underlying.balanceOf(address(vault)), initialVaultBalance);

        // Initialize the strategy
        vault.addStrategy(address(strategy), ratio);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        // Check the leftover amount in the vault (taking the rounding error into account)
        uint256 strategyBalance = (uint256(initialVaultBalance) * ratio) /
            MAX_BPS;
        uint256 vaultBalance = initialVaultBalance - strategyBalance;
        _assertEqWithRoundingError(
            vaultBalance,
            underlying.balanceOf(address(vault))
        );

        // Check the strategy balance
        assertEq(underlying.balanceOf(address(strategy)), strategyBalance);
    }

    /// @dev Testing redistribution of the amount of underlying assets between the vault and the strategies
    ///      This particaular case is for Strategy -> Vault transfer
    function testVaultFromStrategyLendingFunctionality() public {
        uint192 initialVaultBalance = 1_000_000;
        uint16 ratio = uint16(MAX_BPS);

        // We can use the previous test to setup this one
        testVaultToStrategyLendingFunctionality(initialVaultBalance, ratio);

        // Strategy has no free funds, skip this run
        uint256 strategyBalance = underlying.balanceOf(address(strategy));
        if (strategyBalance < 0) {
            return;
        }

        // Check if the vault has other part of the initial funds
        assertEq(
            underlying.balanceOf(address(vault)),
            initialVaultBalance - strategyBalance
        );

        // Assume that the strategy realized a profit and reported it to the vault
        underlying.mint(address(strategy), 10_000);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(10_000, 0);

        // Strategy has the same amount of tokens, because a profit was transferred to the vault
        uint256 strategyBalanceAfter = underlying.balanceOf(address(strategy));
        assertEq(strategyBalance, strategyBalanceAfter);

        // Vault now has a "profit" amount from the strategy
        assertEq(
            underlying.balanceOf(address(vault)),
            initialVaultBalance - strategyBalance + 10_000
        );
    }

    function testDepositWithoutBalance(uint192 deposit) public {
        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        vm.expectRevert(
            deposit > 0
                ? bytes("ERC20: transfer amount exceeds balance")
                : abi.encodePacked(GivenAssetsResultIsZeroShares.selector)
        );

        vm.prank(alice);
        vault.deposit(deposit);
    }

    function testDepositWithoutAllowance(uint192 deposit) public {
        vm.assume(deposit > 0);

        vm.expectRevert(bytes("ERC20: insufficient allowance"));

        vm.prank(alice);
        vault.deposit(deposit);
    }

    function testDepositWhenVaultIsPaused(uint192 deposit) public {
        vault.setEmergencyShutdown(true);

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        vm.expectRevert(bytes("Pausable: paused"));

        vm.prank(alice);
        vault.deposit(deposit);
    }

    function testDepositReentrance(uint192 deposit) public {
        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        vm.expectRevert(bytes("ReentrancyGuard: reentrant call"));

        vm.prank(alice);
        vault.reentrantDeposit(deposit);
    }

    function testDepositAndAssessShares(uint192 deposit) public {
        vm.assume(deposit > 0 && deposit < MAX_DEPOSIT);

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), deposit);

        vm.prank(alice);
        vault.deposit(deposit);

        // Check if Alice's funds were transferred to the vault
        assertEq(underlying.balanceOf(alice), 0);

        // Check if Alice got the vault shares
        assertEq(vault.balanceOf(alice), deposit);
    }

    function testWithdrawWithSufficeVaultUnderlyingBalance(
        uint128 withdrawAmount
    ) public {
        vm.assume(withdrawAmount > 0);

        // Mint some initial funds for the vault
        underlying.mint(address(vault), withdrawAmount);
        assertEq(vault.freeAssets(), withdrawAmount);

        // Provide 1:1 shares of this amount to Alice
        vault.mint(alice, withdrawAmount);
        assertEq(vault.balanceOf(alice), withdrawAmount);

        vm.prank(alice);
        vault.withdraw(withdrawAmount);

        assertEq(vault.freeAssets(), 0);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(alice), withdrawAmount);
    }

    function testWithdrawWithoutUserShareBalance(uint128 withdrawAmount)
        public
    {
        vm.assume(withdrawAmount > 0);

        // Mint some initial funds for the vault
        underlying.mint(address(vault), withdrawAmount);
        assertEq(vault.freeAssets(), withdrawAmount);

        vm.expectRevert(bytes("ERC777: burn amount exceeds balance"));

        vm.prank(alice);
        vault.withdraw(withdrawAmount);
    }

    function testRevertWithdrawWhenVaultAndStrategiesHasNoBalance(
        uint128 withdrawAmount
    ) public {
        // Vault balance (withdrawAmount / 2) should be > 0, otherwise there will be a revert.
        vm.assume(withdrawAmount > 1);

        // Mint some initial funds for the vault
        uint256 vaultBalance = withdrawAmount / 2;
        underlying.mint(address(vault), vaultBalance);
        assertEq(vault.freeAssets(), vaultBalance);
        assertEq(vault.totalAssets(), vaultBalance);

        // Provide 1:1 shares of this amount to Alice
        vault.mint(alice, withdrawAmount);
        assertEq(vault.balanceOf(alice), withdrawAmount);

        vm.expectRevert(
            abi.encodeWithSelector(
                InsufficientVaultBalance.selector,
                withdrawAmount,
                vault.previewWithdraw(withdrawAmount)
            )
        );

        vm.prank(alice);
        vault.withdraw(withdrawAmount);
    }

    function testWithdrawWhenVaultShouldTakeFundsFromStrategies(
        uint128 vaultBalance,
        uint128 strategyBalance,
        uint128 withdrawAmount
    ) public {
        vm.assume(withdrawAmount > 0 && withdrawAmount < MAX_DEPOSIT);
        vm.assume(vaultBalance > 0);
        vm.assume(withdrawAmount > vaultBalance);
        vm.assume(strategyBalance >= withdrawAmount - vaultBalance);

        address vaultAddress = address(vault);
        address strategyAddress = address(strategy);

        // Mint the initial funds as "strategyBalance" for the vault to give this full amount to the strategy
        underlying.mint(vaultAddress, strategyBalance);
        assertEq(vault.freeAssets(), strategyBalance);
        assertEq(vault.totalAssets(), strategyBalance);

        // Provide 1:1 shares of this amount to Alice
        vault.mint(alice, withdrawAmount);
        assertEq(vault.balanceOf(alice), withdrawAmount);

        // Setup strategy and add some funds to it
        vm.prank(strategyAddress);
        underlying.increaseAllowance(vaultAddress, type(uint256).max);
        vault.addStrategy(strategyAddress, MAX_BPS);
        vm.prank(strategyAddress);
        vault.reportPositiveDebtManagement(0, 0);

        // Check that strategy recived all the funds after the report
        _assertEqWithRoundingError(
            underlying.balanceOf(strategyAddress),
            strategyBalance
        );
        _assertEqWithRoundingError(vault.freeAssets(), 0);

        // Mint some initial funds for the vault
        underlying.mint(vaultAddress, vaultBalance);
        _assertEqWithRoundingError(vault.freeAssets(), vaultBalance);

        uint256 aliceSharesToReturn = vault.previewWithdraw(withdrawAmount);

        vm.prank(alice);
        vault.withdraw(withdrawAmount);

        // Sometimes, if "withdrawAmount" is small value, Alice still has 1 share
        assertEq(vault.balanceOf(alice), withdrawAmount - aliceSharesToReturn);
        assertEq(underlying.balanceOf(alice), withdrawAmount);
    }

    function testPartialWithdrawFromStrategies(
        uint96 _aliceAmount,
        uint96 _bobAmount,
        uint96 _partialWihthdrawnAmount
    ) public {
        uint256 aliceAmount = _aliceAmount;
        uint256 bobAmount = _bobAmount;
        uint256 partialWihthdrawnAmount = _partialWihthdrawnAmount;
        vm.assume(aliceAmount > 0);
        vm.assume(bobAmount > 0);
        vm.assume(partialWihthdrawnAmount > 0 && partialWihthdrawnAmount < aliceAmount);

        address vaultAddress = address(vault);
        address strategyAddress = address(strategy);

        depositToVault(alice, aliceAmount);
        depositToVault(bob, bobAmount);

        // Setup strategy and add some funds to it
        vm.prank(strategyAddress);
        underlying.increaseAllowance(vaultAddress, type(uint256).max);
        vault.addStrategy(strategyAddress, MAX_BPS);
        vm.prank(strategyAddress);
        vault.reportPositiveDebtManagement(0, 0);

        // Check that strategy recived all the funds after the report
        _assertEqWithRoundingError(
            underlying.balanceOf(strategyAddress),
            aliceAmount + bobAmount
        );
        _assertEqWithRoundingError(vault.freeAssets(), 0);

        assertEq(vault.currentDebt(strategyAddress), aliceAmount + bobAmount);
        vm.prank(strategyAddress);
        assertEq(vault.currentDebtRatio(), MAX_BPS);

        assertEq(vault.maxWithdraw(alice), aliceAmount);
        assertEq(vault.maxWithdraw(bob), bobAmount);

        uint256 aliceSharesToReturn = vault.previewWithdraw(partialWihthdrawnAmount);
        uint256 aliceSharesBalanceBefore = vault.balanceOf(alice);
        // same for bob
        uint256 bobUnderlyingBalanceInVault = vault.maxWithdraw(bob);
        uint256 bobSharesBalanceBefore = vault.balanceOf(bob);

        vm.prank(alice);
        vault.withdraw(partialWihthdrawnAmount);

        // Sometimes, if "aliceAmount" is small value, Alice still has 1 share
        assertEq(vault.balanceOf(alice), aliceSharesBalanceBefore - aliceSharesToReturn);
        assertEq(underlying.balanceOf(alice), partialWihthdrawnAmount);
        // check bob
        assertEq(vault.balanceOf(bob), bobSharesBalanceBefore);
        assertEq(vault.maxWithdraw(bob), bobUnderlyingBalanceInVault);

        assertEq(vault.currentDebt(strategyAddress), aliceAmount + bobAmount - partialWihthdrawnAmount);
        vm.prank(strategyAddress);
        assertEq(vault.currentDebtRatio(), MAX_BPS);
    }

    function testWithdrawReentrance(uint192 withdraw) public {
        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        vault.mint(alice, withdraw);

        vm.expectRevert(bytes("ReentrancyGuard: reentrant call"));

        vm.prank(alice);
        vault.reentrantWithdraw(withdraw);
    }

    function testSetLockedProfitReleaseRate(uint256 rate) public {
        vm.assume(rate <= LOCKED_PROFIT_RELEASE_SCALE);

        assertEq(vault.lockedProfitReleaseRate(), defaultLPRRate);

        vm.expectEmit(true, true, true, true);
        vault.emitLockedProfitReleaseRateChanged(rate);
        vault.setLockedProfitReleaseRate(rate);

        assertEq(vault.lockedProfitReleaseRate(), rate);
    }

    function testRevertWhenSetLockedProfitReleaseRateWithWrongValue() public {
        assertEq(vault.lockedProfitReleaseRate(), defaultLPRRate);

        uint256 rate = LOCKED_PROFIT_RELEASE_SCALE + 1;
        vm.expectRevert(
            abi.encodeWithSelector(
                InvalidLockedProfitReleaseRate.selector,
                rate
            )
        );
        vault.setLockedProfitReleaseRate(rate);
    }

    function testLockedProfitRelease1() public {
        uint256 initialVaultBalance = 10_000_000;
        uint256 gain = 1_000_000;
        uint256 fees = 0;
        uint256 foundersFees = 0;
        uint256 lockedProfitReleaseRate = LOCKED_PROFIT_RELEASE_SCALE / 6 hours;

        _initVaultWithStrategy(
            initialVaultBalance,
            fees,
            lockedProfitReleaseRate,
            foundersFees
        );

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(strategy), gain);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(gain, 0);

        // Immediately after the report, all profit should be locked
        assertEq(vault.totalAssets(), initialVaultBalance);
        assertEq(vault.calculateLockedProfit(), gain);

        // Let's assume that half of locked period passed
        vm.warp(block.timestamp + 3 hours);
        _assertEqWithRoundingError(
            vault.totalAssets(),
            initialVaultBalance + gain / 2
        );
        _assertEqWithRoundingError(vault.calculateLockedProfit(), gain / 2);

        // Let's assume that the entire locked period passed, all profit should be released
        vm.warp(block.timestamp + 3 hours);
        _assertEqWithRoundingError(
            vault.totalAssets(),
            initialVaultBalance + gain
        );
        _assertEqWithRoundingError(vault.calculateLockedProfit(), 0);
    }

    function testLockedProfitReleaseWithFees() public {
        uint256 initialVaultBalance = 10_000_000;
        uint256 gain = 1_000_000;
        uint256 fees = 500;
        uint256 foundersFees = 500;
        uint256 lockedProfitReleaseRate = LOCKED_PROFIT_RELEASE_SCALE / 6 hours;

        _initVaultWithStrategy(
            initialVaultBalance,
            fees,
            lockedProfitReleaseRate,
            foundersFees
        );

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(strategy), gain);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(gain, 0);

        // Immediately after the report, all profit should be locked (except the fees)
        uint256 feesAmount = (fees * gain) / MAX_BPS + (foundersFees * gain) / MAX_BPS;
        assertEq(vault.totalAssets(), initialVaultBalance + feesAmount);
        assertEq(vault.calculateLockedProfit(), gain - feesAmount);

        // Let's assume that half of locked period passed
        vm.warp(block.timestamp + 3 hours);
        _assertEqWithRoundingError(
            vault.totalAssets(),
            initialVaultBalance + (gain + feesAmount) / 2
        );
        _assertEqWithRoundingError(
            vault.calculateLockedProfit(),
            (gain - feesAmount) / 2
        );

        // Let's assume that the entire locked period passed, all profit should be released
        vm.warp(block.timestamp + 3 hours);
        _assertEqWithRoundingError(
            vault.totalAssets(),
            initialVaultBalance + gain
        );
        _assertEqWithRoundingError(vault.calculateLockedProfit(), 0);
    }

    function testFounderFeeCanBeClaimed(uint96 _aliceAmount, uint96 _bobAmount) public {
        uint256 aliceAmount = uint256(_aliceAmount);
        uint256 bobAmount = uint256(_bobAmount);
        vm.assume(aliceAmount >= 200);
        vm.assume(bobAmount >= aliceAmount * vaultFounderToken.nextTokenPriceMultiplier() / vaultFounderToken.MAX_BPS());

        uint256 initialVaultBalance = 0;
        uint256 gain = 1_000_000;
        uint256 fees = 500;
        uint256 foundersFees = 500;
        uint256 lockedProfitReleaseRate = LOCKED_PROFIT_RELEASE_SCALE / 6 hours;

        _initVaultWithStrategy(
            initialVaultBalance,
            fees,
            lockedProfitReleaseRate,
            foundersFees
        );

        // Give the required funds to Alice and Bob
        underlying.mint(alice, aliceAmount);
        underlying.mint(bob, bobAmount);

        // Allow the vault to take funds from Alice and Bob
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);
        vm.prank(bob);
        underlying.increaseAllowance(address(vault), type(uint256).max);
        vm.prank(alice);
        vault.deposit(aliceAmount);
        vm.prank(bob);
        vault.deposit(bobAmount);

        assertEq(underlying.balanceOf(address(vault)), aliceAmount + bobAmount);
        assertEq(underlying.balanceOf(address(alice)), 0);
        assertEq(underlying.balanceOf(address(bob)), 0);
        assertEq(vaultFounderToken.totalSupply(), 2);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(strategy), gain);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(gain, 0);

        // Immediately after the report, all profit should be locked (except the fees)
        uint256 feesAmount = (fees * gain) / MAX_BPS + (foundersFees * gain) / MAX_BPS;
        assertEq(vault.totalAssets(), initialVaultBalance + feesAmount + aliceAmount + bobAmount);
        assertEq(vault.calculateLockedProfit(), gain - feesAmount);

        // check alice has balance

        (uint256 aliceReward, ) = vaultFounderToken.previewReward(alice);
        assertGt(aliceReward, 0);
        (uint256 bobReward, ) = vaultFounderToken.previewReward(bob);
        assertGt(bobReward, 0);

        uint256 aliceBalanceBefore = vault.balanceOf(address(alice));
        uint256 bobBalanceBefore = vault.balanceOf(address(bob));

        // let's try to claim rewards
        vm.prank(alice);
        vaultFounderToken.claimReward();

        assertEq(vault.balanceOf(address(alice)), aliceBalanceBefore + aliceReward);
        assertEq(vault.balanceOf(address(bob)), bobBalanceBefore);
        assertEq(underlying.balanceOf(address(alice)), 0);
        assertEq(underlying.balanceOf(address(bob)), 0);


        // check alice has empty balance after claim and bob still has balance
        (uint256 aliceReward1, ) = vaultFounderToken.previewReward(alice);
        assertEq(aliceReward1, 0);
        (uint256 bobReward1, ) = vaultFounderToken.previewReward(bob);
        assertEq(bobReward1, bobReward);
    }

    function testLockedProfitReleaseWithNegativeReport() public {
        uint256 initialVaultBalance = 10_000_000;
        uint256 gain = 1_000_000;
        uint256 loss = 250_000;
        uint256 fees = 0;
        uint256 foundersFees = 0;
        uint256 lockedProfitReleaseRate = LOCKED_PROFIT_RELEASE_SCALE / 6 hours;

        _initVaultWithStrategy(
            initialVaultBalance,
            fees,
            lockedProfitReleaseRate,
            foundersFees
        );

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(strategy), gain);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(gain, 0);

        // Immediately after the report, all profit should be locked
        assertEq(vault.totalAssets(), initialVaultBalance);
        assertEq(vault.calculateLockedProfit(), gain);

        // Let's assume that half of locked period passed
        vm.warp(block.timestamp + 3 hours);
        _assertEqWithRoundingError(
            vault.totalAssets(),
            initialVaultBalance + gain / 2
        );
        _assertEqWithRoundingError(vault.calculateLockedProfit(), gain / 2);

        // Half of the time passed and strategy reported about the loss.
        underlying.burn(address(strategy), loss);
        vm.prank(address(strategy));
        vault.reportNegativeDebtManagement(loss, 0);

        _assertEqWithRoundingError(
            vault.totalAssets(),
            initialVaultBalance + gain / 2
        );
        _assertEqWithRoundingError(
            vault.calculateLockedProfit(),
            gain / 2 - loss
        );
    }

    function testUnderlyingAsset() public {
        assertEq(address(vault.asset()), address(underlying));
    }

    function _initVaultWithStrategy(
        uint256 initialVaultBalance,
        uint256 fees,
        uint256 lockedProfitReleaseRate,
        uint256 foundersFee
    ) private {
        vault = new VaultMock(
            address(underlying),
            rewards,
            fees,
            lockedProfitReleaseRate,
            foundersFee
        );
        vault.setFounders(address(vaultFounderToken));
        vaultFounderToken.setVault(vault);
        strategy = new StrategyMock(address(underlying), address(vault));

        if(initialVaultBalance > 0) {
            // Mint some initial funds for the vault
            underlying.mint(address(vault), initialVaultBalance);
        }
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);
    }

    function _assertEqWithRoundingError(uint256 a, uint256 b) private {
        uint256 max = Math.max(a, b);
        uint256 min = Math.min(a, b);
        assertLe(max - min, 1);
    }

    function testFounderTokenMint(uint192 deposit) public {
        // deposit have to be above min first investment
        vm.assume(deposit > 200 && deposit < MAX_DEPOSIT);


        vault = new VaultMock(
            address(underlying),
            rewards,
            0,
            defaultLPRRate,
            0
        );
        
        vaultFounderToken = new VaultFounderTokenMock(3, 12_000, 200, vault);
        vault.setFounders(address(vaultFounderToken));

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), deposit);
        assertEq(vaultFounderToken.totalSupply(), 0);

        vm.prank(alice);
        vault.deposit(deposit);

        // Check if Alice has a new vault founder token generated
        assertEq(vaultFounderToken.totalSupply(), 1);
    }

    function testFounderTokenMintWithoutVaultFounderToken(uint192 deposit) public {
        // deposit have to be above min first investment
        vm.assume(deposit > 200 && deposit < MAX_DEPOSIT);


        vault = new VaultMock(
            address(underlying),
            rewards,
            0,
            defaultLPRRate,
            0
        );

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, deposit);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), deposit);

        vm.prank(alice);
        vault.deposit(deposit);

        // Check if Alice has a new vault founder token generated
    }

    function testRevertWhenRemovingLifecycleHookFromNonOwnerAccount() public {
        IVaultHookMock hook1 = new IVaultHookMock();
        vault.registerDepositHook(hook1);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));

        vm.prank(culprit);
        vault.unregisterLifecycleHook(hook1);
    }

    function testShouldRemoveLifecycleHook() public {
        IVaultHookMock hook1 = new IVaultHookMock();
        IVaultHookMock hook2 = new IVaultHookMock();
        IVaultHookMock hook3 = new IVaultHookMock();

        vault.registerDepositHook(hook1);
        vault.registerDepositHook(hook2);

        assertEq(vault.unregisterLifecycleHook(hook1), true);
        assertEq(vault.unregisterLifecycleHook(hook2), true);
        assertEq(vault.unregisterLifecycleHook(hook3), false);
    }

    function depositToVault(address actor, uint256 amount) internal {
        // Give the required funds to Actor
        underlying.mint(actor, amount);
        assertEq(underlying.balanceOf(actor), amount);

        // Allow to vault to take the Actor's assets
        vm.prank(actor);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        uint256 vaultBalanceBefore = underlying.balanceOf(address(vault));
        uint256 actorVaultBalanceBefore = vault.balanceOf(actor);
        uint256 actorUnderlyingVaultBalanceBefore = vault.maxWithdraw(actor);

        // Actor deposits funds to the vault
        vm.prank(actor);
        vault.deposit(amount);
        assertEq(underlying.balanceOf(address(vault)), vaultBalanceBefore + amount);
        assertGt(vault.balanceOf(actor), actorVaultBalanceBefore);
        assertEq(vault.maxWithdraw(actor), actorUnderlyingVaultBalanceBefore + amount);
    }
}
