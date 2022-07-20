// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {MockERC20} from "./mocks/MockERC20.sol";
import {ImplementSafeERC4626} from "./implementations/ImplementSafeERC4626.sol";

contract ERC4626Test is Test {
    MockERC20 underlying;
    ImplementSafeERC4626 vault;

    address alice;
    address bob;
    address carl;

    function setUp() public {
        underlying = new MockERC20("Mock Token", "TKN");
        
        address[] memory defaultOperators;
        vault = new ImplementSafeERC4626(IERC20Upgradeable(address(underlying)), "Mock Token Vault", "vwTKN", defaultOperators);

        alice = address(0xAAAA);
        bob = address(0xBBBB);
        carl = address(0xCCCC);
    }

    function invariantMetadata() public {
        assertEq(vault.name(), "Mock Token Vault");
        assertEq(vault.symbol(), "vwTKN");
        assertEq(vault.decimals(), 18);
    }

    function testMetadata(string calldata name, string calldata symbol) public {
        address[] memory defaultOperators;
        ImplementSafeERC4626 vlt = new ImplementSafeERC4626(IERC20Upgradeable(address(underlying)), name, symbol, defaultOperators);

        assertEq(vlt.name(), name);
        assertEq(vlt.symbol(), symbol);
        assertEq(address(vlt.asset()), address(underlying));
    }

    function testSingleDepositWithdraw(
        uint96 _depositAmount, 
        uint96 _depositAlowance, 
        uint128 _keepInBalance, 
        bool useBackcombatibleDeposit,
        bool useBackcombatibleWithdraw
    ) public {
        vm.assume(_depositAmount > 0);
        vm.assume(_depositAlowance >= _depositAmount);

        // prevent overflow
        uint256 depositAmount = _depositAmount;
        uint256 keepInBalance = _keepInBalance;
        uint256 depositAlowance = _depositAlowance;

        underlying.mint(alice, depositAlowance + keepInBalance);

        vm.prank(alice); 
        underlying.approve(address(vault), depositAlowance);
        assertEq(underlying.allowance(alice, address(vault)), depositAlowance);

        uint256 alicePreDepositBal = underlying.balanceOf(alice);
        uint256 expectedShares = vault.previewDeposit(depositAmount);
        assertEq(vault.convertToShares(depositAmount), expectedShares);

        // Alise deposit money
        vm.prank(alice);
        uint256 aliceShareAmount = useBackcombatibleDeposit 
            ? vault.deposit(depositAmount, alice) 
            : vault.deposit(depositAmount);

        assertEq(expectedShares, aliceShareAmount);
        assertEq(vault.afterDepositHookCalledCounter(), 1);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 0);
        // Expect exchange rate to be 1:1 on initial deposit.
        assertEq(depositAmount, aliceShareAmount);
        assertEq(vault.previewWithdraw(depositAmount), aliceShareAmount);
        assertEq(vault.previewRedeem(aliceShareAmount), depositAmount);
        assertEq(vault.previewDeposit(depositAmount), aliceShareAmount);
        assertEq(vault.previewMint(aliceShareAmount), depositAmount);
        assertEq(vault.totalSupply(), aliceShareAmount);
        assertEq(vault.totalAssets(), depositAmount);
        assertEq(vault.balanceOf(alice), aliceShareAmount);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), depositAmount);
        assertEq(vault.convertToShares(depositAmount), vault.balanceOf(alice));
        assertEq(underlying.balanceOf(alice), alicePreDepositBal - depositAmount);
        assertEq(underlying.balanceOf(address(vault)), depositAmount);

        uint256 expectedWithdrawShares = vault.previewWithdraw(depositAmount);

        // Alise withdraw money
        vm.prank(alice);
        uint256 withdrawedShares = useBackcombatibleWithdraw 
            ? vault.withdraw(depositAmount, alice, alice) 
            : vault.withdraw(depositAmount);

        assertEq(withdrawedShares, expectedWithdrawShares);
        // Expect 1:1 withdraw
        assertEq(withdrawedShares, depositAmount);

        assertEq(vault.afterDepositHookCalledCounter(), 1);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 1);

        assertEq(vault.totalAssets(), 0);
        assertEq(vault.totalSupply(), 0);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 0);
        assertEq(underlying.balanceOf(alice), alicePreDepositBal);
        assertEq(underlying.balanceOf(address(vault)), 0);
    }

    function testSingleMintRedeem(
        uint96 _shareAmount, 
        uint96 _depositAlowance,
        uint128 _keepInBalance,
        bool useBackcombatibleMint,
        bool useBackcombatibleRedeem
    ) public {
        vm.assume(_shareAmount > 0);
        vm.assume(_depositAlowance >= _shareAmount);

        // prevent overflow
        uint256 shareAmount = _shareAmount;
        uint256 keepInBalance = _keepInBalance;
        uint256 depositAlowance = _depositAlowance;

        underlying.mint(alice, shareAmount + keepInBalance);

        vm.prank(alice);
        underlying.approve(address(vault), depositAlowance);
        assertEq(underlying.allowance(alice, address(vault)), depositAlowance);

        uint256 alicePreDepositBal = underlying.balanceOf(alice);
        uint256 expectedUnderlying = vault.previewMint(shareAmount);
        assertEq(vault.convertToAssets(shareAmount), expectedUnderlying);

        // Alice mint shares in exchange to money
        vm.prank(alice);
        uint256 aliceUnderlyingAmount = useBackcombatibleMint 
            ? vault.mint(shareAmount, alice)
            : vault.mint(shareAmount);

        assertEq(aliceUnderlyingAmount, expectedUnderlying);
        assertEq(vault.afterDepositHookCalledCounter(), 1);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 0);
        // Expect exchange rate to be 1:1 on initial mint.
        assertEq(shareAmount, aliceUnderlyingAmount);
        assertEq(vault.previewWithdraw(aliceUnderlyingAmount), shareAmount);
        assertEq(vault.previewRedeem(shareAmount), aliceUnderlyingAmount);
        assertEq(vault.previewDeposit(aliceUnderlyingAmount), shareAmount);
        assertEq(vault.previewMint(shareAmount), aliceUnderlyingAmount);
        assertEq(vault.totalSupply(), shareAmount);
        assertEq(vault.totalAssets(), aliceUnderlyingAmount);
        assertEq(vault.balanceOf(alice), shareAmount);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), aliceUnderlyingAmount);
        assertEq(vault.convertToShares(aliceUnderlyingAmount), vault.balanceOf(alice));
        assertEq(underlying.balanceOf(alice), alicePreDepositBal - aliceUnderlyingAmount);
        assertEq(underlying.balanceOf(address(vault)), aliceUnderlyingAmount);

        uint256 expectedRedeemUnderlying = vault.previewRedeem(shareAmount);

        // Alice redeem shares to recive money
        vm.prank(alice);
        uint256 redeemUnderlying = useBackcombatibleRedeem 
            ? vault.redeem(shareAmount, alice, alice) 
            : vault.redeem(shareAmount);

        assertEq(redeemUnderlying, expectedRedeemUnderlying);
        // Expect 1:1 redeem
        assertEq(redeemUnderlying, shareAmount);

        assertEq(vault.afterDepositHookCalledCounter(), 1);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 1);

        assertEq(vault.totalAssets(), 0);
        assertEq(vault.totalSupply(), 0);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 0);
        assertEq(underlying.balanceOf(alice), alicePreDepositBal);
        assertEq(underlying.balanceOf(address(vault)), 0);
    }

    // Scenario:
    // A = Alice, B = Bob
    //  ________________________________________________________
    // | Vault shares | A share | A assets | B share | B assets |
    // |========================================================|
    // | 1. Alice mints 2000 shares (costs 2000 tokens)         |
    // |--------------|---------|----------|---------|----------|
    // |         2000 |    2000 |     2000 |       0 |        0 |
    // |--------------|---------|----------|---------|----------|
    // | 2. Bob deposits 4000 tokens (mints 4000 shares)        |
    // |--------------|---------|----------|---------|----------|
    // |         6000 |    2000 |     2000 |    4000 |     4000 |
    // |--------------|---------|----------|---------|----------|
    // | 3. Vault mutates by +3000 tokens...                    |
    // |    (simulated yield returned from strategy)...         |
    // |--------------|---------|----------|---------|----------|
    // |         6000 |    2000 |     3000 |    4000 |     6000 |
    // |--------------|---------|----------|---------|----------|
    // | 4. Alice deposits 2000 tokens (mints 1333 shares)      |
    // |--------------|---------|----------|---------|----------|
    // |         7333 |    3333 |     4999 |    4000 |     6000 |
    // |--------------|---------|----------|---------|----------|
    // | 5. Bob mints 2000 shares (costs 3001 assets)           |
    // |    NOTE: Bob's assets spent got rounded up             |
    // |    NOTE: Alice's vault assets got rounded up           |
    // |--------------|---------|----------|---------|----------|
    // |         9333 |    3333 |     5000 |    6000 |     9000 |
    // |--------------|---------|----------|---------|----------|
    // | 6. Vault mutates by +3000 tokens...                    |
    // |    (simulated yield returned from strategy)            |
    // |    NOTE: Vault holds 17001 tokens, but sum of          |
    // |          assetsOf() is 17000.                          |
    // |--------------|---------|----------|---------|----------|
    // |         9333 |    3333 |     6071 |    6000 |    10929 |
    // |--------------|---------|----------|---------|----------|
    // | 7. Alice redeem 1333 shares (2428 assets)              |
    // |--------------|---------|----------|---------|----------|
    // |         8000 |    2000 |     3643 |    6000 |    10929 |
    // |--------------|---------|----------|---------|----------|
    // | 8. Bob withdraws 2928 assets (1608 shares)             |
    // |--------------|---------|----------|---------|----------|
    // |         6392 |    2000 |     3643 |    4392 |     8000 |
    // |--------------|---------|----------|---------|----------|
    // | 9. Alice withdraws 3643 assets (2000 shares)           |
    // |    NOTE: Bob's assets have been rounded back up        |
    // |--------------|---------|----------|---------|----------|
    // |         4392 |       0 |        0 |    4392 |     8001 |
    // |--------------|---------|----------|---------|----------|
    // | 10. Bob redeem 4392 shares (8001 tokens)               |
    // |--------------|---------|----------|---------|----------|
    // |            0 |       0 |        0 |       0 |        0 |
    // |______________|_________|__________|_________|__________|
    function testMultipleMintDepositRedeemWithdraw() public {
        uint256 mutationUnderlyingAmount = 3000;

        // 0. Prepara users balances
        underlying.mint(alice, 4000);

        vm.prank(alice);
        underlying.approve(address(vault), 4000);

        assertEq(underlying.allowance(alice, address(vault)), 4000);

        underlying.mint(bob, 7001);

        vm.prank(bob);
        underlying.approve(address(vault), 7001);

        assertEq(underlying.allowance(bob, address(vault)), 7001);

        // 1. Alice mints 2000 shares (costs 2000 tokens)
        uint256 aliceExpectedUnderlyingAmount = vault.previewMint(2000);
        vm.prank(alice);
        uint256 aliceUnderlyingAmount = vault.mint(2000, alice);

        assertEq(aliceUnderlyingAmount, aliceExpectedUnderlyingAmount);
        assertEq(vault.afterDepositHookCalledCounter(), 1);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 0);

        uint256 aliceShareAmount = vault.balanceOf(alice);
        // Expect to have received the requested mint amount.
        assertEq(aliceShareAmount, 2000);
        assertEq(vault.balanceOf(alice), aliceShareAmount);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), aliceUnderlyingAmount);
        assertEq(vault.convertToShares(aliceUnderlyingAmount), vault.balanceOf(alice));
        assertEq(underlying.balanceOf(alice), 2000);
        assertEq(underlying.balanceOf(address(vault)), 2000);

        // Expect a 1:1 ratio before mutation.
        assertEq(aliceUnderlyingAmount, 2000);

        // Sanity check.
        assertEq(vault.totalSupply(), aliceShareAmount);
        assertEq(vault.totalAssets(), aliceUnderlyingAmount);

        // 2. Bob deposits 4000 tokens (mints 4000 shares)
        uint256 bobExpectedUnderlyingAmount = vault.previewDeposit(4000);
        vm.prank(bob);
        uint256 bobShareAmount = vault.deposit(4000, bob);
        uint256 bobUnderlyingAmount = vault.previewWithdraw(bobShareAmount);
        
        assertEq(bobShareAmount, bobExpectedUnderlyingAmount);
        assertEq(vault.afterDepositHookCalledCounter(), 2);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 0);

        // Expect to have received the requested underlying amount.
        assertEq(bobUnderlyingAmount, 4000);
        assertEq(vault.balanceOf(bob), bobShareAmount);
        assertEq(vault.balanceOf(alice), aliceShareAmount);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), bobUnderlyingAmount);
        assertEq(vault.convertToShares(bobUnderlyingAmount), vault.balanceOf(bob));
        assertEq(underlying.balanceOf(bob), 3001);
        assertEq(underlying.balanceOf(address(vault)), 6000);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 2000);
        assertEq(vault.convertToShares(aliceUnderlyingAmount), 2000);
        assertEq(vault.previewWithdraw(aliceUnderlyingAmount), 2000);
        assertEq(vault.previewRedeem(aliceShareAmount), 2000);

        // Expect a 1:1 ratio before mutation.
        assertEq(bobShareAmount, bobUnderlyingAmount);

        // Sanity check...
        uint256 preMutationShareBal = aliceShareAmount + bobShareAmount;
        uint256 preMutationBal = aliceUnderlyingAmount + bobUnderlyingAmount;
        assertEq(vault.totalSupply(), preMutationShareBal);
        assertEq(vault.totalAssets(), preMutationBal);
        assertEq(vault.totalSupply(), 6000);
        assertEq(vault.totalAssets(), 6000);

        // 3. Vault mutates by +3000 tokens...                    |
        //    (simulated yield returned from strategy)...
        // The Vault now contains more tokens than deposited which causes the exchange rate to change.
        // Alice share is 33.33% of the Vault, Bob 66.66% of the Vault.
        // Alice's share count stays the same but the underlying amount changes from 2000 to 3000.
        // Bob's share count stays the same but the underlying amount changes from 4000 to 6000.
        underlying.mint(address(vault), mutationUnderlyingAmount);

        assertEq(vault.totalSupply(), preMutationShareBal);
        assertEq(vault.totalAssets(), preMutationBal + mutationUnderlyingAmount);
        assertEq(vault.balanceOf(alice), aliceShareAmount);
        assertEq(
            vault.convertToAssets(vault.balanceOf(alice)),
            aliceUnderlyingAmount + (mutationUnderlyingAmount / 3) * 1
        );
        assertEq(
            vault.previewRedeem(vault.balanceOf(alice)),
            aliceUnderlyingAmount + (mutationUnderlyingAmount / 3) * 1
        );
        assertEq(
            vault.previewWithdraw(aliceUnderlyingAmount + (mutationUnderlyingAmount / 3) * 1),
            vault.balanceOf(alice)
        );
        assertEq(
            vault.convertToShares(aliceUnderlyingAmount + (mutationUnderlyingAmount / 3) * 1), 
            vault.balanceOf(alice)
        );
        assertEq(vault.balanceOf(bob), bobShareAmount);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), bobUnderlyingAmount + (mutationUnderlyingAmount / 3) * 2);
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), bobUnderlyingAmount + (mutationUnderlyingAmount / 3) * 2);
        assertEq(vault.previewWithdraw(bobUnderlyingAmount + (mutationUnderlyingAmount / 3) * 2), vault.balanceOf(bob));
        assertEq(vault.convertToShares(bobUnderlyingAmount + (mutationUnderlyingAmount / 3) * 2), vault.balanceOf(bob));

        // 4. Alice deposits 2000 tokens (mints 1333 shares)
        uint256 aliceExpectedSharesAmount = vault.previewDeposit(2000);
        vm.prank(alice);
        uint256 aliceDepositedShares = vault.deposit(2000, alice);

        assertEq(aliceExpectedSharesAmount, aliceDepositedShares);
        assertEq(aliceDepositedShares, 1333);
        assertEq(vault.afterDepositHookCalledCounter(), 3);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 0);

        assertEq(vault.totalSupply(), 7333);
        assertEq(vault.balanceOf(alice), 3333);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 4999);
        assertEq(vault.convertToShares(4999), vault.balanceOf(alice) - 1); // rounding error
        assertEq(vault.balanceOf(bob), 4000);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 6000);
        assertEq(vault.convertToShares(6000), vault.balanceOf(bob) - 1); // rounding error
        assertEq(vault.previewRedeem(aliceDepositedShares), 2000 - 1); // rounding error
        assertEq(vault.previewWithdraw(2000), aliceDepositedShares + 1); // rounding error
        assertEq(vault.previewRedeem(vault.balanceOf(alice)), 4999);
        assertEq(vault.previewWithdraw(4999), vault.balanceOf(alice));
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), 6000);
        assertEq(vault.previewWithdraw(6000), vault.balanceOf(bob));

        // sanity check...
        assertEq(vault.totalAssets(), 11000);
        assertEq(underlying.balanceOf(address(vault)), 11000);
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), 3001);

        // 5. Bob mints 2000 shares (costs 3001 assets)
        // NOTE: Bob's assets spent got rounded up
        // NOTE: Alices's vault assets got rounded up
        bobExpectedUnderlyingAmount = vault.previewMint(2000);
        vm.prank(bob);
        uint256 bobMintedUnderlyingAmount = vault.mint(2000, bob);

        assertEq(bobExpectedUnderlyingAmount, bobMintedUnderlyingAmount);
        assertEq(bobMintedUnderlyingAmount, 3001);
        assertEq(vault.afterDepositHookCalledCounter(), 4);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 0);

        assertEq(vault.totalSupply(), 9333);
        assertEq(vault.balanceOf(alice), 3333);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 5000);
        assertEq(vault.convertToShares(5000), vault.balanceOf(alice) - 1); // rounding error
        assertEq(vault.balanceOf(bob), 6000);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 9000);
        assertEq(vault.convertToShares(9000), vault.balanceOf(bob) - 1); // rounding error
        assertEq(vault.previewRedeem(2000), bobMintedUnderlyingAmount - 1); // rounding error
        assertEq(vault.previewWithdraw(bobMintedUnderlyingAmount), 2000 + 1); // rounding error
        assertEq(vault.convertToShares(bobMintedUnderlyingAmount), 2000);
        assertEq(vault.previewRedeem(vault.balanceOf(alice)), 4999 + 1); // rounding error
        assertEq(vault.previewWithdraw(4999), vault.balanceOf(alice));
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), 9000);
        assertEq(vault.previewWithdraw(9000), vault.balanceOf(bob));

        // Sanity checks:
        // Alice and bob should have spent all their tokens now
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), 0);
        // Assets in vault: 4k (alice) + 7k (bob) + 3k (yield) + 1 (round up)
        assertEq(underlying.balanceOf(address(vault)), 14001);
        assertEq(vault.totalAssets(), 14001);

        // 6. Vault mutates by +3000 tokens
        // NOTE: Vault holds 17001 tokens, but sum of assetsOf() is 17000.
        underlying.mint(address(vault), mutationUnderlyingAmount);

        assertEq(vault.totalSupply(), 9333);
        assertEq(vault.totalAssets(), 17001);
        assertEq(underlying.balanceOf(address(vault)), 17001);
        assertEq(vault.balanceOf(alice), 3333);
        assertEq(vault.balanceOf(bob), 6000);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 6071);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 10929);
        assertEq(vault.convertToShares(6071), vault.balanceOf(alice) - 1); // rounding error
        assertEq(vault.convertToShares(10929), vault.balanceOf(bob) - 1); // rounding error
        assertEq(vault.previewRedeem(vault.balanceOf(alice)), 6071);
        assertEq(vault.previewWithdraw(6071),vault.balanceOf(alice));
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), 10929);
        assertEq(vault.previewWithdraw(10929), vault.balanceOf(bob));

        // 7. Alice redeem 1333 shares (2428 assets)
        uint256 aliceExpectedRedeemUnderlying = vault.previewRedeem(1333);
        vm.prank(alice);
        uint256 aliceRedeemUnderlyting = vault.redeem(1333, alice, alice);

        assertEq(aliceExpectedRedeemUnderlying, aliceRedeemUnderlyting);
        assertEq(aliceRedeemUnderlyting, 2428);
        assertEq(vault.afterDepositHookCalledCounter(), 4);
        assertEq(vault.beforeWithdrawHookCalledCounter(), 1);

        assertEq(underlying.balanceOf(alice), 2428);
        assertEq(vault.totalSupply(), 8000);
        assertEq(vault.totalAssets(), 14573);
        assertEq(underlying.balanceOf(address(vault)), 14573);
        assertEq(vault.balanceOf(alice), 2000);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 3643);
        assertEq(vault.convertToShares(3643), vault.balanceOf(alice) - 1); // rounding error
        assertEq(vault.previewRedeem(vault.balanceOf(alice)), 3643);
        assertEq(vault.previewWithdraw(3643),vault.balanceOf(alice));
        assertEq(vault.balanceOf(bob), 6000);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 10929);
        assertEq(vault.convertToShares(10929), vault.balanceOf(bob) - 1); // rounding error
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), 10929);
        assertEq(vault.previewWithdraw(10929), vault.balanceOf(bob));

        // 8. Bob withdraws 2929 assets (1608 shares)
        uint256 bobExpectedWithdrawShares = vault.previewWithdraw(2929);
        vm.prank(bob);
        uint256 bobWithdrawShares = vault.withdraw(2929, bob, bob);

        assertEq(bobExpectedWithdrawShares, bobWithdrawShares);
        assertEq(bobWithdrawShares, 1608);

        assertEq(underlying.balanceOf(bob), 2929);
        assertEq(vault.totalSupply(), 6392);
        assertEq(vault.totalAssets(), 11644);
        assertEq(underlying.balanceOf(address(vault)), 11644);
        assertEq(vault.balanceOf(alice), 2000);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 3643);
        assertEq(vault.convertToShares(3643), vault.balanceOf(alice) - 1); // rounding error
        assertEq(vault.previewRedeem(vault.balanceOf(alice)), 3643);
        assertEq(vault.previewWithdraw(3643),vault.balanceOf(alice));
        assertEq(vault.balanceOf(bob), 4392);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 8000);
        assertEq(vault.convertToShares(8000), vault.balanceOf(bob) - 1); // rounding error
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), 8000);
        assertEq(vault.previewWithdraw(8000), vault.balanceOf(bob)); 

        // 9. Alice withdraws 3643 assets (2000 shares)
        // NOTE: Bob's assets have been rounded back up
        uint256 aliceExpectedWithdrawShares = vault.previewWithdraw(3643);
        vm.prank(alice);
        uint256 aliceWithdrawShares = vault.withdraw(3643, alice, alice);

        assertEq(aliceExpectedWithdrawShares, aliceWithdrawShares);
        assertEq(aliceWithdrawShares, 2000);

        assertEq(underlying.balanceOf(alice), 6071);
        assertEq(vault.totalSupply(), 4392);
        assertEq(vault.totalAssets(), 8001);
        assertEq(underlying.balanceOf(address(vault)), 8001);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 0);
        assertEq(vault.previewRedeem(vault.balanceOf(alice)), 0);
        assertEq(vault.balanceOf(bob), 4392);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 8001);
        assertEq(vault.convertToShares(8001), vault.balanceOf(bob));
        assertEq(vault.previewRedeem(vault.balanceOf(bob)), 8001);
        assertEq(vault.previewWithdraw(8001), vault.balanceOf(bob)); 

        // 10. Bob redeem 4392 shares (8001 tokens)
        uint256 bobExpectedRedeemUnderlying = vault.previewRedeem(4392);
        vm.prank(bob);
        uint256 bobRedeemUnderlying = vault.redeem(4392, bob, bob);

        assertEq(bobExpectedRedeemUnderlying, bobRedeemUnderlying);
        assertEq(bobRedeemUnderlying, 8001);

        assertEq(underlying.balanceOf(bob), 10930);
        assertEq(vault.totalSupply(), 0);
        assertEq(vault.totalAssets(), 0);
        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 0);
        assertEq(vault.balanceOf(bob), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(bob)), 0);

        // Sanity check
        assertEq(underlying.balanceOf(address(vault)), 0);
    }

    function testFailDepositWithNotEnoughApproval(uint128 balance, uint128 deposit) public {
        vm.assume(balance > 0);
        vm.assume(deposit > balance);

        underlying.mint(alice, balance);
        
        vm.prank(alice);
        underlying.approve(address(vault), balance);
        assertEq(underlying.allowance(alice, address(vault)), balance);

        vm.prank(alice);
        vault.deposit(deposit, alice);
    }

    function testFailMintWithNotEnoughApproval(uint128 balance, uint128 deposit) public {
        vm.assume(balance > 0);
        vm.assume(deposit > balance);

        underlying.mint(alice, balance);
        
        vm.prank(alice);
        underlying.approve(address(vault), balance);
        assertEq(underlying.allowance(alice, address(vault)), balance);

        vm.prank(alice);
        vault.mint(deposit, alice);
    }

    function testFailWithdrawWithNotEnoughUnderlyingAmount(uint128 balance, uint128 withdraw) public {
        vm.assume(balance > 0);
        vm.assume(withdraw > balance);

        underlying.mint(alice, balance);
        
        vm.prank(alice);
        underlying.approve(address(vault), balance);

        vm.prank(alice);
        vault.deposit(balance, alice);

        vm.prank(alice);
        vault.withdraw(withdraw, alice, alice);
    }

    function testFailRedeemWithNotEnoughShareAmount(uint128 balance, uint128 redeem) public {
        vm.assume(balance > 0);
        vm.assume(redeem > balance);

        underlying.mint(alice, balance);

        vm.prank(alice);
        underlying.approve(address(vault), balance);

        vm.prank(alice);
        vault.deposit(balance, alice);

        vm.prank(alice);
        vault.redeem(redeem, alice, alice);
    }

    function testFailWithdrawWithNoUnderlyingAmount(uint128 withdraw) public {
        vm.assume(withdraw > 0);

        vm.prank(alice);
        vault.withdraw(withdraw, alice, alice);
    }

    function testFailRedeemWithNoShareAmount(uint128 redeem) public {
        // included zero reddem fail
        vm.prank(alice);
        vault.redeem(redeem, alice, alice);
    }

    function testFailDepositWithNoApproval(uint128 deposit) public {
        // included zero deposit fail
        vm.prank(alice);
        vault.deposit(deposit, alice);
    }

    function testFailMintWithNoApproval(uint128 mint) public {
        vm.assume(mint > 0);

        vm.prank(alice);
        vault.mint(mint, alice);
    }

    function testMintZeroAllowed() public {
        vm.prank(alice);
        vault.mint(0, alice);

        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 0);
        assertEq(vault.totalSupply(), 0);
        assertEq(vault.totalAssets(), 0);
    }

    function testWithdrawZeroAllowed() public {
        vm.prank(alice);
        vault.withdraw(0, alice, alice);

        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.convertToAssets(vault.balanceOf(alice)), 0);
        assertEq(vault.totalSupply(), 0);
        assertEq(vault.totalAssets(), 0);
    }

    function testVaultInteractionsForSomeoneElseNotWorking(uint96 aliceAmount, uint96 bobAmount) public {
        vm.assume(aliceAmount > 0);
        vm.assume(bobAmount > 0);

        // init 2 users with a 1 ether balance
        underlying.mint(alice, aliceAmount);
        underlying.mint(bob, bobAmount);

        vm.prank(alice);
        underlying.approve(address(vault), aliceAmount);

        vm.prank(bob);
        underlying.approve(address(vault), bobAmount);

        // alice try deposits 1 ether for bob
        vm.prank(alice);
        vault.deposit(aliceAmount, bob);

        assertEq(vault.balanceOf(alice), aliceAmount);
        assertEq(vault.balanceOf(bob), 0);
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), bobAmount);

        // bob try mint 1 ether for alice
        vm.prank(bob);
        vault.mint(bobAmount, alice);
        assertEq(vault.balanceOf(alice), aliceAmount);
        assertEq(vault.balanceOf(bob), bobAmount);
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), 0);

        // alice try redeem 1 ether for bob
        vm.prank(alice);
        vault.redeem(aliceAmount, bob, alice);

        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.balanceOf(bob), bobAmount);
        assertEq(underlying.balanceOf(alice), aliceAmount);
        assertEq(underlying.balanceOf(bob), 0);

        // bob try withdraw 1 ether for alice
        vm.prank(bob);
        vault.withdraw(bobAmount, alice, bob);

        assertEq(vault.balanceOf(alice), 0);
        assertEq(vault.balanceOf(bob), 0);
        assertEq(underlying.balanceOf(alice), aliceAmount);
        assertEq(underlying.balanceOf(bob), bobAmount);
    }

    function testFailVaultInteractionsThroughApproveHaveNoEffect(uint96 aliceAmount, uint96 bobAmount, bool tryRedeem) public {
        vm.assume(aliceAmount > 0);
        vm.assume(bobAmount > 0);

        // init 2 users with a 1 ether balance
        underlying.mint(alice, aliceAmount);
        underlying.mint(bob, bobAmount);

        vm.prank(alice);
        underlying.approve(address(vault), aliceAmount);

        vm.prank(bob);
        underlying.approve(address(vault), bobAmount);

        // alice deposits 1 ether
        vm.prank(alice);
        vault.deposit(aliceAmount, alice);

        assertEq(vault.balanceOf(alice), aliceAmount);
        assertEq(vault.balanceOf(bob), 0);
        assertEq(vault.balanceOf(carl), 0);
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), bobAmount);
        assertEq(underlying.balanceOf(carl), 0);

        // bob mint 1 ether
        vm.prank(bob);
        vault.mint(bobAmount, bob);
        assertEq(vault.balanceOf(alice), aliceAmount);
        assertEq(vault.balanceOf(bob), bobAmount);
        assertEq(vault.balanceOf(carl), 0);
        assertEq(underlying.balanceOf(alice), 0);
        assertEq(underlying.balanceOf(bob), 0);
        assertEq(underlying.balanceOf(carl), 0);

        // bob allow carl spend 1 ether
        vm.prank(bob);
        vault.approve(carl, bobAmount);

        assertEq(vault.allowance(bob, carl), bobAmount);

        // carl try redeem or withdraw 1 ether from bob to alice
        vm.prank(carl);
        if (tryRedeem) {
            vault.redeem(bobAmount, alice, bob);
        } else {
            vault.withdraw(bobAmount, alice, bob);
        }
    }

    function testFailVaultWithdrawWithoutApprove(uint96 aliceAmount, uint96 bobAmount, bool tryRedeem) public {
        vm.assume(aliceAmount > 0);
        vm.assume(bobAmount > 0);

        // init 2 users with a 1 ether balance
        underlying.mint(alice, aliceAmount);
        underlying.mint(bob, bobAmount);

        vm.prank(alice);
        underlying.approve(address(vault), aliceAmount);

        vm.prank(bob);
        underlying.approve(address(vault), bobAmount);

        // alice deposits 1 ether
        vm.prank(alice);
        vault.deposit(aliceAmount, alice);

        // bob mint 1 ether
        vm.prank(bob);
        vault.mint(bobAmount, bob);

        // bob allow carl spend 1 ether
        vm.prank(bob);
        vault.approve(carl, bobAmount);

        assertEq(vault.allowance(bob, carl), bobAmount);

        // alice allow bob spend 1 ether
        vm.prank(alice);
        vault.approve(bob, aliceAmount);

        assertEq(vault.allowance(alice, bob), aliceAmount);
        assertEq(vault.allowance(alice, carl), 0);
        assertEq(vault.allowance(bob, carl), 0);

        // bob withdraw 1 ether for carl from alice
        vm.prank(carl);
        if(tryRedeem) {
            vault.redeem(aliceAmount, bob, alice);
        } else {
            vault.withdraw(aliceAmount, bob, alice);
        }
    }

    
}