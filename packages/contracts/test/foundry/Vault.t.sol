// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";

import "./mocks/VaultMock.sol";
import "./mocks/ERC20Mock.sol";
import "./mocks/StrategyMock.sol";

contract VaultTest is Test {
    uint256 constant MAX_BPS = 10_000;

    ERC20Mock underlying;
    VaultMock vault;

    StrategyMock strategy;

    address rewards = vm.addr(1);
    address culprit = vm.addr(2);

    address alice = vm.addr(10);
    address bob = vm.addr(11);

    uint256 defaultFee = 1000;

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        underlying = new ERC20Mock("Mock Token", "TKN");
        vault = new VaultMock(address(underlying), rewards, defaultFee);

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
            "",
            "",
            new address[](0)
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
        VaultMock wrongVault = new VaultMock(address(underlying), rewards, 0);
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
        assertEq(vault.strategyRatio(strategyAddress), debtRatio);

        vm.expectEmit(true, true, true, true);
        vault.emitStrategyRevokedEvent(strategyAddress);

        vault.revokeStrategy(strategyAddress);
        assertEq(vault.debtRatio(), 0);
        assertEq(vault.strategyRatio(strategyAddress), 0);
    }

    function testRevertWhenRevokingStrategyFromNonOwnerAccount() public {
        address strategyAddress = address(strategy);
        vault.addStrategy(strategyAddress, MAX_BPS);

        vm.expectRevert(bytes("Ownable: caller is not the owner"));

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
        vm.assume(newFee <= MAX_BPS);

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

    function testChargingFees() public {
        uint256 fee = MAX_BPS;

        vault = new VaultMock(address(underlying), rewards, fee);
        strategy = new StrategyMock(address(underlying), address(vault));

        // Mint some initial funds for the vault
        underlying.mint(address(vault), 10_000_000);
        vm.prank(address(strategy));
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Initialize the strategy
        vault.addStrategy(address(strategy), MAX_BPS);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(0, 0);

        vm.expectEmit(true, true, true, true);
        vault.emitTransferEvent(rewards, 10_000);

        // Assume some time passed and strategy got a profit
        vm.warp(block.timestamp + 1000);
        underlying.mint(address(vault), 10_000);
        vm.prank(address(strategy));
        vault.reportPositiveDebtManagement(10_000, 0);

        // The full amount must be transferred to the rewards address, as the fee factor is 100%
        assertEq(vault.balanceOf(rewards), 10_000);
    }

    function testChargingFeesFuzz(
        uint192 initialVaultBalance,
        uint16 fee,
        uint16 strategyRatio,
        uint256 strategyGain
    ) public {
        vm.assume(fee <= MAX_BPS);
        vm.assume(strategyRatio <= MAX_BPS);
        vm.assume(
            strategyGain <
                (uint256(initialVaultBalance) * strategyRatio) / MAX_BPS
        );

        vault = new VaultMock(address(underlying), rewards, fee);
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
            vault.emitTransferEvent(rewards, expectedShares);
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

        assertEq(vault.totalAssets(), initialVaultBalance + gain);
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
            bytes(
                deposit > 0
                    ? "ERC20: transfer amount exceeds balance"
                    : "Given assets result in 0 shares."
            )
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
        vm.assume(deposit > 0);

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

    function _assertEqWithRoundingError(uint256 a, uint256 b) private {
        uint256 max = Math.max(a, b);
        uint256 min = Math.min(a, b);
        assertLe(max - min, 1);
    }
}
