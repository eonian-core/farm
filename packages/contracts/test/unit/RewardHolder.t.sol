// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.19;

import {Test} from "forge-std/Test.sol";

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

    function testDepositReward(uint192 _amount) public {
        uint256 amount = _amount;
        vm.assume(amount > 0);

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
        rewardHolder.emitRewardClaimed(amount, address(alice), true);
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

    function testCorrectRewardClaimed(uint128 _aliceAmount, uint128 _bobAmount, uint128 _reward) public {
        uint256 aliceAmount = _aliceAmount;
        uint256 bobAmount = _bobAmount;
        uint256 reward = _reward;
        vm.assume(aliceAmount > 0 && bobAmount > 0 && reward > 0);

        // Allow the vault to take funds from Alice, Bob
        vm.prank(alice);
        underlying.increaseAllowance(address(vault), type(uint256).max);
        vm.prank(bob);
        underlying.increaseAllowance(address(vault), type(uint256).max);

        // Give the required funds to Alice, Bob
        underlying.mint(alice, aliceAmount);
        underlying.mint(bob, bobAmount);

        // Check if they has the initial balance
        assertEq(underlying.balanceOf(alice), aliceAmount);
        assertEq(underlying.balanceOf(bob), bobAmount);

        // Put the funds in the vault to be able move them in to the reward holder
        vm.prank(alice);
        vault.deposit(aliceAmount);
        vm.prank(bob);
        vault.deposit(bobAmount);

        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), 0);

        uint256 aliceBalanceBefore = vault.balanceOf(alice);
        uint256 bobBalanceBefore = vault.balanceOf(bob);

        // Put funds on vault to be able to move them to token owners from the reward holder
        rewardHolder.setupOwner(address(alice));
        rewardHolder.setupOwner(address(bob));
        assertEq(rewardHolder.numberCoins(), 2);
        assertEq(rewardHolder.rewardOwnerIndex(alice), 1);
        assertEq(rewardHolder.rewardOwnerIndex(bob), 1);

        vault.mint(address(rewardHolder), reward);
        rewardHolder.depositReward(reward);
        assertEq(rewardHolder.rewardIndex(), reward + 1);

        uint256 aliceReward = reward / 2;
        uint256 bobReward = aliceReward;
        uint256 claimableIndex = (reward + 1) - reward % 2;

        (uint256 _aliceReward1, uint256 aliceIndex1) = rewardHolder.previewReward(alice);
        // same for bob
        (uint256 _bobReward1, uint256 bobIndex1) = rewardHolder.previewReward(bob);

        // before claim all rewards are equal are smaller one
        assertEq(_aliceReward1, _bobReward1);
        assertEq(_aliceReward1, aliceReward);
        assertEq(aliceIndex1, bobIndex1);
        assertEq(aliceIndex1, claimableIndex);
        if(aliceReward == 0) {
            return;
        }

        // Send reward to Alice and check emits
        vm.expectEmit(address(rewardHolder));
        rewardHolder.emitRewardClaimed(aliceReward, address(alice), true);
        vm.prank(alice);
        rewardHolder.claimReward();

        assertEq(vault.balanceOf(alice), aliceBalanceBefore + aliceReward);
        assertEq(vault.balanceOf(bob), bobBalanceBefore);
        assertEq(rewardHolder.rewardOwnerIndex(alice), claimableIndex);
        assertEq(rewardHolder.rewardOwnerIndex(bob), 1);

        // after first reward claimed, bob will receive same reward
        (uint256 _bobReward2, uint256 bobIndex2) = rewardHolder.previewReward(bob);
        assertEq(_bobReward2, bobReward);
        assertEq(bobIndex2, claimableIndex);

        // Send reward to Bob and check emits
        vm.expectEmit(address(rewardHolder));
        rewardHolder.emitRewardClaimed(bobReward, address(bob), true);
        vm.prank(bob);
        rewardHolder.claimReward();

        assertEq(vault.balanceOf(alice), aliceBalanceBefore + aliceReward);
        assertEq(vault.balanceOf(bob), bobBalanceBefore + bobReward);

        assertEq(rewardHolder.rewardOwnerIndex(alice), claimableIndex);
        assertEq(rewardHolder.rewardOwnerIndex(bob), claimableIndex);
    }

    function testCorrectRewardClaimed2(uint128 _reward) public {
        uint256 reward = _reward;
        vm.assume(reward > 0);

        rewardHolder.depositReward(reward);

        // to users set and reward have to be zero
        (uint256 previewReward1, uint256 previewIndex1) = rewardHolder.previewReward(msg.sender);
        assertEq(previewReward1, 0);
        assertEq(previewIndex1, reward + 1);

        // setup new token owners and reward still have to be zero
        rewardHolder.setupOwner(address(alice));
        rewardHolder.setupOwner(address(bob));
        rewardHolder.setupOwner(address(culprit));

        // check for contract owner
        (uint256 previewReward2, uint256 previewIndex2) = rewardHolder.previewReward(msg.sender);
        assertEq(previewReward2, 0);
        assertEq(previewIndex2, reward + 1);
        // check for alice
        (uint256 previewReward3, uint256 previewIndex3) = rewardHolder.previewReward(alice);
        assertEq(previewReward3, 0);
        assertEq(previewIndex3, reward + 1);

        // deposit additional reward
        rewardHolder.depositReward(reward);

        // check for alice
        (uint256 previewReward4, uint256 previewIndex4) = rewardHolder.previewReward(alice);
        assertEq(previewReward4, reward / 3);
        assertEq(previewIndex4, (reward * 2 + 1) - reward % 3);
    }
}