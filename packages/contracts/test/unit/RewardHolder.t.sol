// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.19;

import "forge-std/Test.sol";

import {TestWithERC1820Registry} from "./helpers/TestWithERC1820Registry.sol";
import {AccessTestHelper} from "./helpers/AccessTestHelper.sol";

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";
import {RewardHolderMock} from "./mocks/RewardHolderMock.sol";
import {VaultMock} from "./mocks/VaultMock.sol";
import {ERC20Mock} from "./mocks/ERC20Mock.sol";

contract ERC5484UpgradeableTest is TestWithERC1820Registry {
    using FixedPointMathLib for uint256;

    RewardHolderMock private rewardHolder;

    uint256 defaultFee = 1000;
    uint256 defaultLPRRate = 10**18;
    uint256 defaultFounderRate = 100;

    ERC20Mock underlying;
    VaultMock vault;

    address rewards = vm.addr(1);
    address culprit = vm.addr(2);

    address private alice = vm.addr(10);
    address private bob = vm.addr(11);

    // allow sending eth to the test contract
    receive() external payable {}

    function setUp() public {
        vm.label(alice, "Alice");
        vm.label(bob, "Bob");

        underlying = new ERC20Mock("Mock Token", "TKN");
        vault = new VaultMock(
            address(underlying),
            rewards,
            defaultFee,
            defaultLPRRate,
            defaultFounderRate
        );

        rewardHolder = new RewardHolderMock();
        rewardHolder.grantRole(rewardHolder.BALANCE_UPDATER_ROLE(), address(this));
        rewardHolder.setVault(vault);
    }

    function testDepositReward(uint192 amount) public {
        vm.assume(amount > 10**11 && amount < address(this).balance);

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, amount);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), amount);

        // Put the funds in the vault to be able move them in to the reward holder
        vm.prank(alice);
        vault.deposit(amount);

        assertEq(underlying.balanceOf(alice), 0);

        uint256 aliceBalanceBefore = vault.balanceOf(alice);

        // Put funds on vault to be able to move them to token owners from the reward holder
        rewardHolder.setupOwner(address(alice));
        vault.mint(address(rewardHolder), amount);

        vm.expectEmit(address(rewardHolder));
        rewardHolder.emitRewardDeposited(amount);
        rewardHolder.depositReward(amount);

        assertEq(rewardHolder.numberCoins(), 1);
        assertEq(rewardHolder.rewardIndex(), amount + 1);

        // Send reward to Alice and check emits
        vm.expectEmit(address(rewardHolder));
        rewardHolder.emitRewardClaimed(amount, address(alice));
        vm.prank(alice);
        rewardHolder.claimReward();

        // Check if Alice has the expected balance
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(vault.balanceOf(alice), aliceBalanceBefore + amount);
    }

    function testDepositRewardFail(uint192 amount) public {
        vm.assume(amount > 10**11 && amount < address(this).balance);

        // Allow the vault to take funds from Alice but not from test to check roles
        rewardHolder.revokeRole(rewardHolder.BALANCE_UPDATER_ROLE(), address(this));
        rewardHolder.grantRole(rewardHolder.BALANCE_UPDATER_ROLE(), address(alice));

        // Allow the vault to take funds from Alice
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, amount);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), amount);

        // Put the funds in the vault to be able move them in to the reward holder
        vm.prank(alice);
        vault.deposit(amount);

        // Put funds on vault to be able to move them to token owners from the reward holder
        vm.prank(alice);
        rewardHolder.setupOwner(address(alice));
        vault.mint(address(rewardHolder), amount);

        vm.expectRevert(
            abi.encodePacked(
                AccessTestHelper.getErrorMessage(address(this), rewardHolder.BALANCE_UPDATER_ROLE())
            )
        );
        rewardHolder.depositReward(amount);

    }

    function testSetupNewsOwner() public {
        rewardHolder.setupOwner(address(alice));
        assertEq(rewardHolder.numberCoins(), 1);
    }

    function testSetupNewOwnerFail() public {
        rewardHolder = new RewardHolderMock();
        rewardHolder.setVault(vault);

        vm.expectRevert(
            abi.encodePacked(
                AccessTestHelper.getErrorMessage(address(this), rewardHolder.BALANCE_UPDATER_ROLE())
            )
        );
        rewardHolder.setupOwner(address(alice));
    }

    function testCorrectRewardClaimed() public {
        uint256 amount = 30000000;

        // Allow the vault to take funds from Alice, Bob
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);
        vm.prank(bob);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice
        underlying.mint(alice, amount);
        underlying.mint(bob, amount);

        // Check if Alice has the initial balance
        assertEq(underlying.balanceOf(alice), amount);
        assertEq(underlying.balanceOf(bob), amount);

        // Put the funds in the vault to be able move them in to the reward holder
        vm.prank(alice);
        vault.deposit(amount);
        vm.prank(bob);
        vault.deposit(amount);

        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), 0);

        uint256 aliceBalanceBefore = vault.balanceOf(alice);
        uint256 bobBalanceBefore = vault.balanceOf(bob);

        // Put funds on vault to be able to move them to token owners from the reward holder
        rewardHolder.setupOwner(address(alice));
        rewardHolder.setupOwner(address(bob));
        vault.mint(address(rewardHolder), amount);
        rewardHolder.depositReward(amount);

        assertEq(rewardHolder.rewardIndex(), amount + 1);

        // Send reward to Alice and check emits
        vm.expectEmit(address(rewardHolder));
        rewardHolder.emitRewardClaimed(amount / 2, address(alice));
        vm.prank(alice);
        rewardHolder.claimReward();

        assertEq(vault.balanceOf(alice), aliceBalanceBefore + amount / 2);
        assertEq(vault.balanceOf(bob), bobBalanceBefore);
    }

    function testCorrectRewardClaimed2(uint256 reward) public {
        vm.assume(reward > 0 && reward < type(uint256).max / 2);

        rewardHolder.depositReward(reward);

        // to users set and reward have to be zero
        assertEq(rewardHolder.calcReward(), 0);

        // setup new token owners and reward still have to be zero
        rewardHolder.setupOwner(address(alice));
        rewardHolder.setupOwner(address(bob));
        rewardHolder.setupOwner(address(culprit));

        // check for contract owner
        assertEq(rewardHolder.calcReward(), 0);
        // check for alice
        vm.prank(alice);
        assertEq(rewardHolder.calcReward(), 0);

        // deposit additional reward
        rewardHolder.depositReward(reward);

        vm.prank(alice);
        assertEq(rewardHolder.calcReward(), reward / 3);
    }
}