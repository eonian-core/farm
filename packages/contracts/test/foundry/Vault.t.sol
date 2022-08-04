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

    uint256 fee = 1000;

    function setUp() public {
        vm.label(rewards, "rewards");
        vm.label(culprit, "culprit");

        underlying = new ERC20Mock("Mock Token", "TKN");
        vault = new VaultMock(address(underlying), rewards, fee);

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
            fee,
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

    function testSetRewardsAddressFromNonOwnerAccount() public {
        address newRewardsAddress = vm.addr(3);
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        vault.setRewards(newRewardsAddress);
    }

    function testSetManagementFee(uint256 newFee) public {
        vm.assume(newFee <= MAX_BPS);

        assertEq(vault.managementFee(), fee);

        vault.setManagementFee(newFee);
        assertEq(vault.managementFee(), newFee);
    }

    function testSetManagementFeeFromNonOwnerAccount(uint256 newFee) public {
        vm.assume(newFee <= MAX_BPS);
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(culprit);
        vault.setManagementFee(newFee);
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
}
